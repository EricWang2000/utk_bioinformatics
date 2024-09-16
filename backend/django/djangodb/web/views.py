import os
import zipfile
import glob
import requests # type: ignore
from django.shortcuts import render, redirect
from .models import AlphaSum
from rest_framework.parsers import JSONParser
from django.http import HttpResponse, JsonResponse, Http404
from django.conf import settings
from django.contrib import messages
from .forms import AlphaSerializer
from django.views.decorators.csrf import csrf_exempt



ALPHAFILL_URL = "https://alphafill.eu/v1/aff"

def home(request):
    if request.method == "GET":
        all = AlphaSum.objects.all()
        
        all_serial = AlphaSerializer(all, many=True)
        return JsonResponse(all_serial.data, safe=False)

def open_file(request, file):
    if request.method == "GET":
        messages.success(request, "lol")
        print("#")
        filepath = os.path.join(settings.BASE_DIR, file)
        print(filepath)
        if filepath.endswith('.zip'):
            return JsonResponse({"data": "Z"})
        if not os.path.exists(filepath):
            return JsonResponse({"data": "M"})
        with open(filepath, "r") as file_des:
            return JsonResponse({"data": file_des.read()})
        
        
        
def unzip(file):
    file = str(file)
    name = file.split(".")[0]
    file_path = os.path.join(settings.BASE_DIR, 'uploads', "tar", file)
    with zipfile.ZipFile(file_path, 'r') as zf:
        zf.extractall(path = f'uploads/unzipped/{name}.result')
    return name

def alphafill(name, pattern = "rank_001"):
    pattern = f"*{pattern}*.pdb"

    
    pdb_path_bad = glob.glob(f"uploads/unzipped/{name}.result/{name}/{pattern}")[0]
    print(pdb_path_bad)
    pdb_path = f"uploads/pdb/{name}.pdb"
    os.rename(pdb_path_bad, pdb_path)
    files = {
        "structure": open(pdb_path, "rb")
    }
    response = requests.post(ALPHAFILL_URL, files=files).json()
    id = response['id']

    while True:
        if requests.get(f"{ALPHAFILL_URL}/{id}/status").json()['status'] == "finished": break

    response = requests.get(f"{ALPHAFILL_URL}/{id}").text
    cif_path = f"uploads/cif/{name}.cif"
    with open(cif_path, "w") as f:
        f.write(response)
    return cif_path, pdb_path

@csrf_exempt
def add(request):
    if request.method == "POST":
        data = request.POST    
        tar_file = request.FILES.get('tar_file')
        pattern = data['pattern']
        print("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        print(pattern)
        print(tar_file)
        print("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        input = {
            'name' : data['name'],
            'tar_file' : tar_file,
            # 'pdb_file' : pdb_file, 
            # 'cif_file' : cif_file
        }
        os.makedirs("uploads", exist_ok=True)
        os.makedirs("uploads/pdb", exist_ok=True)
        os.makedirs("uploads/cif", exist_ok=True)
        os.makedirs("uploads/tar", exist_ok=True)
        os.makedirs("uploads/unzipped", exist_ok=True)
        data_serializer = AlphaSerializer(data=input)
        if data_serializer.is_valid():

            data_serializer.save()
            tar_file_name= unzip(tar_file)
            cif_file, pdb_file = alphafill(tar_file_name, pattern)
            AlphaSum.objects.filter(name=data['name']).update(
                pdb_file = pdb_file, 
                cif_file = cif_file
            )
            print(tar_file)
          
            
            tar = os.path.join('uploads', 'tar', str(tar_file))
            
            return JsonResponse({'name':data['name'], 
                                 "tar_file": tar,
                                 "pdb_file":pdb_file,
                                 "cif_file":cif_file})

        return JsonResponse("some thing wrong", safe=False)
        
    if request.method == "GET":
        all = AlphaSum.objects.all()
        all_serial = AlphaSerializer(all, many=True)
        return JsonResponse(all_serial.data, safe=False)
def view(request, name):
    data = AlphaSum.objects.get(name=name)
    data_serialized = AlphaSerializer(data)
    return JsonResponse(data_serialized.data, safe=False)

from django.contrib.auth.decorators import login_required
from .forms import JoinGroupForm
from django.contrib.auth.models import Group

@login_required
def group_list(request):
    user_groups = request.user.groups.all()
    return render(request, 'group_list.html', {'groups': user_groups})


@login_required
def join_group(request):
    if request.method == 'POST':
        form = JoinGroupForm(request.POST)
        if form.is_valid():
            group = form.cleaned_data['group']
            request.user.groups.add(group)
            return redirect('group_list')
    else:
        form = JoinGroupForm()
    return render(request, 'join_group.html', {'form': form})
from .forms import AddGroupForm

@login_required
def add_group(request):
    if request.method == 'POST':
        form = AddGroupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('join_group')
    else:
        form = AddGroupForm()
    return render(request, 'add_group.html', {'form': form})

def download_file(request, name):
    try:
        # Retrieve the AlphaSum instance based on the file_id (name in this case)
        alpha_sum_instance = AlphaSum.objects.get(name=name)

        # Access the pdb_file from the AlphaSum instance
        file = alpha_sum_instance.pdb_file

        # If the file exists, create an HTTP response to download the file
        if file:
            response = HttpResponse(file, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file.name}"'
            return response
        else:
            raise Http404("File not found")
    except AlphaSum.DoesNotExist:
        raise Http404("File not found in the database")