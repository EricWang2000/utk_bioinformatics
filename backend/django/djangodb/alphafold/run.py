import sys, os
import subprocess
import argparse

parser = argparse.ArgumentParser(prog = "run.py", add_help=True, 
         description='export path to your localcolabfolder first using: export PATH="/path/to/your/localcolabfold/colabfold-conda/bin:$PATH"')

parser.add_argument("--fa_files", required=True)

args = vars(parser.parse_args())

fa_files = args["fa_files"]

for i in os.listdir(fa_files):
   output_dir = i.split('.')[0]

   print(f"-- Running AlphaFold on {output_dir}. Outputs in '{output_dir}/'. --")
   subprocess.run(['colabfold_batch', '--templates', f'{fa_files}/{i}', output_dir])

   print("-- AlphaFold completed. Transfering files. --")

   subprocess.run(["expect", "transfer.exp", output_dir, "&"])
   print(f"-- {output_dir} done --")
