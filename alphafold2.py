import os
import re
import hashlib
import random

# hash function 
def add_hash(x,y):
  return x+"_"+hashlib.sha1(y.encode()).hexdigest()[:5]

query_seq: str = input("Input Query Sequence: ")

# use ":" to specific inter-protein chainbreaks

jobname: str = input("Job name: ")

try:
    num_relax: int = int(input("num_relax: 0|1|5 "))
except ValueError:
   print("-- num_relax must be 0, 1, or 5 --")

template_mode: str = input("Template mode: none|pdb100|custom")

use_amber = num_relax > 0

# remove whitespaces
query_seq = query_seq.strip()
basejobname = jobname.strip()

jobname = add_hash(basejobname, query_seq)

def check(folder):
    return os.path.exist(folder)

# check if there are multiple files with same job names
# prevents data overwriting
if not check(jobname):
   n = 0
   jobname = f"{jobname}_{n}"
   while not check(f"{jobname}_{n}"):
      n += 1

# make directory for results
os.mkdirs(jobname, exist_ok = True)

# save queries
queries_path = os.path.join(jobname, f"{jobname}.csv")
with open (queries_path, "w") as file:
   file.write(f"id, sequence\n{jobname}, {query_seq}")

match template_mode:
   case "pdb100":
      use_templates = True
      c

