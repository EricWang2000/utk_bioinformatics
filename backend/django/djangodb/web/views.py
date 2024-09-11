import os
import zipfile
import glob
import requests # type: ignore
from django.shortcuts import render, redirect
from .models import AlphaSum
from .forms import AlphaSum_Form
from django.conf import settings
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt

ALPHAFILL_URL = "https://alphafill.eu/v1/aff"

def home(request):
    all = AlphaSum.objects.all
    return render(request, "home.html", {"all": all})

def open_file(request, file):
    file_path = os.path.join(settings.BASE_DIR, file)
    with open(file_path, "r") as file_des:
        return render(request, "view_file.html", {"file": file_des.read()})

def unzip(file):
    file = str(file)

    name = file.split(".")[0]
    file_path = os.path.join(settings.BASE_DIR, 'uploads', "tar", file)
    with zipfile.ZipFile(file_path, 'r') as zf:
        zf.extractall(path = f'uploads/unzipped/{name}.result')
    return name

def alphafill(name, pattern = "rank_001"):
    pattern = f"*{pattern}*.pdb"

    os.makedirs("uploads/pdb", exist_ok=True)
    pdb_path_bad = glob.glob(f"uploads/unzipped/{name}.result/{name}/{pattern}")[0]
    pdb_path = f"uploads/pdb/{name}.pdb"
    os.rename(pdb_path_bad, pdb_path)
    files = {
        "structure": open(pdb_path, "rb")
    }
    response = requests.post(ALPHAFILL_URL, files=files).json()
    id = response['id']

    ### ?? 
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
        form = AlphaSum_Form(request.POST, request.FILES or None)
        
        if form.is_valid():
            name = form.cleaned_data["name"]

            if not AlphaSum.objects.filter(name=name).exists():
                form.save()
                file = request.FILES['tar_file']
                pattern = request.POST.get('pattern')
                filename = unzip(file)
                cif_path, pdb_path = alphafill(filename, pattern) 
                AlphaSum.objects.filter(name=name).update(
                    cif_file= cif_path,
                    pdb_file= pdb_path
                )
                messages.success(request, ("Added!"))
                return redirect("view", name)
            else:
                messages.error(request, ("Already Added!"))
                return redirect("home")
        else:
            form_data = {
                "name": request.POST.get("name", ""),
                "tar_file" : request.FILES.get["tar_file"],
                # "pdb_file": request.FILES.get("pdb_file"),
                # "cif_file": request.FILES.get("cif_file"),
                # "img": request.FILES.get("img"),
            }
            
            messages.error(request, ("Missing Entries"))
            return render(request, "add.html", form_data)
    else:
        return render(request, "add.html", {})



def view(request, name):
    searched = AlphaSum.objects.get(name=name)
    return render(request, 'molecular_viewer.html', {
        "name" : searched.name,
        "tar_file" : searched.tar_file,
        "pdb_file" :  searched.pdb_file,
        "cif_file" :  searched.cif_file,
        "img" :  searched.img,
    })

def about(request):
    return render(request, "about.html", {})

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