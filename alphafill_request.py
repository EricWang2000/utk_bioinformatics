"""
Mung-Shu Shen
2024/08/15
"""
from concurrent.futures import ThreadPoolExecutor
import requests
import os
import zipfile
import glob
import sys


if len(sys.argv) != 2 or sys.argv[1] == "--h":
   print() 
   print("""
usage: py alphafill.py [folder-to-zip-files]
   -create folder to put .zip files in
   'unzipped' folder will contain upzipped files
   'pdb' folder will contain the files inputted into AlphaFill
   'cif' folder will contail the results from AlphaFill
   """)
   exit()

zipfolder = sys.argv[1]
unzip_folder = "unzipped"

os.makedirs("pdb", exist_ok = True)
os.makedirs("cif", exist_ok = True)
os.makedirs("unzipped", exist_ok = True)

proteins = []

def files_to_unzip() -> list:
    return glob.glob(f"{zipfolder}/*.zip")

def unzip(file):
    # change to fit linux/windows'
    file = str(file)
    zip_name = file.split('\\')[-1]
    name = zip_name.split(".")[0]
    
    proteins.append({"name": name})
    
    with zipfile.ZipFile(file, "r") as zip_ref:
        zip_ref.extractall(path = f"{unzip_folder}/{name}.result")
    
with ThreadPoolExecutor() as executor:
    executor.map(unzip, files_to_unzip())


# finding input file for alphafill
def find_files(path, pattern="*_001_*.pdb"):
    filename = path["name"]
    
    pdb_filepath = f"{unzip_folder}/{filename}.result/{filename}/{pattern}"
   
    file = glob.glob(pdb_filepath)

    # # change to fit linux/windows
    name = file[0].split("\\")[-1]

    os.replace(file[0], f"pdb/{name}")


with ThreadPoolExecutor() as executor:
    executor.map(find_files, proteins)

alphafill_url = "https://alphafill.eu/v1/aff"

def alphafill_request_url(id):
    return f"{alphafill_url}/{id}"

# posting job and retrieving job id
def post_job(proteins):
    for protein in proteins:
        struct_file = glob.glob(f"pdb/{protein["name"]}*_rank_001_*")[0]
        files = {
            'structure': open(struct_file, "rb")
        }
        response = requests.post(alphafill_url, files=files).json()
        print(f"{protein['name']} -- {response['id']} -- {response['status']}")
        protein['id'] = response['id']

post_job(proteins)

# downloading results
def write_cif(protein):
    """
    Potential Issue:
    Job status could be in queue and not yet processed. 
    Need to wait until job is finished before proceeding
    (How to replicate ?)
    """
    response = requests.get(alphafill_request_url(protein['id'])).text
    cif_filename = protein["name"]
    
    with open(f"cif/{cif_filename}.cif", "w") as file:
        file.write(response)


with ThreadPoolExecutor() as executor:
    executor.map(write_cif, proteins)
