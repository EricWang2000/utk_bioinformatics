from concurrent.futures import ThreadPoolExecutor
import requests
import os
import zipfile
import glob


proteins = []

def files_to_unzip() -> list:
    return glob.glob("*.zip")

def unzip(file):
    name = file[:-4]
    with zipfile.ZipFile(file, "r") as zip_ref:
        zip_ref.extractall(name)

with ThreadPoolExecutor() as executor:
    executor.map(unzip, files_to_unzip())

def find_files(path, pattern="*_001_*.pdb"):
    folders = path.split(".")[0]
    file = glob.glob(f"{folders}.result/{folders}/{pattern}")
    
    name = ("".join(file).split("\\")[-1])
    
    os.replace("".join(file), f"pdb/{name}")
    proteins.append({"name":name})


with ThreadPoolExecutor() as executor:
    executor.map(find_files, files_to_unzip())



url = "https://alphafill.eu/v1/aff"


def alphafill_request(id):
    return f"{url}/{id}"

def post_job(proteins):
    for protein in proteins:
        files = {
            'structure': open(f"pdb/{protein['name']}", "rb")
        }
        response = requests.post(url, files=files).json()
        print(f"{protein['name']} -- {response['id']} -- {response['status']}")
        protein['id'] = response['id']

post_job(proteins)



def write_cif(protein):
    
    response = requests.get(alphafill_request(protein['id'])).text
    cif_filename = "_".join(protein["name"].split('_',2)[:2])
    
    with open(f"cif/{cif_filename}.cif", "w") as file:
        file.write(response)


with ThreadPoolExecutor() as executor:
    executor.map(write_cif, proteins)
