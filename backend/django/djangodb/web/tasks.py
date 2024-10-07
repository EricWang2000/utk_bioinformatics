
from celery import shared_task
from .models import AlphaSum
from .forms import AlphaSerializer
import os, zipfile
from django.conf import settings
import glob
import time
import requests
ALPHAFILL_URL = "https://alphafill.eu/v1/aff"

@shared_task
def get_alpha_data(name):
    data = AlphaSum.objects.get(name=name)
    
    serializer = AlphaSerializer(data)
    return serializer.data

@shared_task
def unzip_task(file): 
    file = str(file)
    name = file.split(".")[0]
    file_path = os.path.join(settings.BASE_DIR, 'uploads', "tar", file)
    with zipfile.ZipFile(file_path, 'r') as zf:
        zf.extractall(path = f'uploads/unzipped/{name}.result')
    return name


@shared_task
def alphafill_task(name, pattern = "rank_001"):
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
import random
chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|[]{}-=,.<>/?"


from celery_progress.backend import ProgressRecorder
@shared_task(bind=True)
def lol(self):
    progress_recorder = ProgressRecorder(self)
    
    try:
        with open("FILE.txt", "a") as file:
            for i in range(6000):
                time.sleep(5)
                x = ["".join(random.choice(chars) for i in range(52))]
                
                file.write(x[0] + '\n')
                file.flush()  # Force the write to happen immediately
                
                progress_recorder.set_progress(i+1, 6000)
    except Exception as e:
        print(f"Error: {e}")
import subprocess
@shared_task
def lolzerr():

    file_path = os.path.join(settings.BASE_DIR, 'alphafold', "poo.py")
    
    result = subprocess.run(
        ["py", file_path], 
        stdout=subprocess.PIPE,  # Capture standard output
        stderr=subprocess.PIPE,  # Capture standard error
        text=True  # Automatically decode output as text (instead of bytes)
    )
    with open("C:/Users/mungs/desktop/utk_bioinformatics/backend/django/djangodb/web/FILE.txt", "w") as a:
        a.write(result.stdout)

    return str(result.stdout) 











    
def lolzer():
    a = open("C:/Users/mungs/desktop/utk_bioinformatics/backend/django/djangodb/web/FILE.txt", "r")
    
    while True:   
        with open("C:/Users/mungs/desktop/utk_bioinformatics/backend/django/djangodb/web/FILE.txt", "r") as a:
            yield a.read()
            a.seek(0, os.SEEK_SET)
            for i in a:
                if (i.strip() == 'DONE'):
                    
                    return a.read()
                    
                    
            a.seek(0, os.SEEK_SET)
            time.sleep(1)
    
    


        
@shared_task(bind=True)
def report_progress(self):
    # Use ProgressRecorder to track progress
    progress_recorder = ProgressRecorder(self)
    
    # Loop through the generator and report progress
    for i, progress in enumerate(lolzer()):
        # Report the progress, setting i+1 as current and 6000 as total steps
        progress_recorder.set_progress(i + 1, 6000, description=progress)
        
