import paramiko
import socket
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("96.38.97.53", port=2200, password="bioutk1", username="bioutk")



command = 'export PATH="localcolabfold/colabfold-conda/bin:$PATH" && nohup python3 run.py --fa fa_files/ 2>&1 &'
# command = 'colabfold_batch --templates fa_files/t.fa'
stdin, stdout, stderr = ssh.exec_command(command)

while True:
    try:
        # stdin, stdout, stderr = ssh.exec_command("tail -f my_log.out")
        # print(stdout.read().decode())
        output = stdout.read(100000).decode("utf-8")

        if output  :
            
            print(output)
        else:
            break  # Break the loop when no more output is available
    except socket.error as e:
        print('Socket error occurred:', e)
        break
    except Exception as e:
        print('An error occurred:', e)
        break

# while 1:
#         # Read lines from stdout
#         if stdout.channel.recv_ready():
#             line = stdout.readline().strip()
#             if line:
#                 print(f"Output: {line}")
#         if stderr.channel.recv_ready():
#             err_line = stderr.readline().strip()
#             if err_line:
#                 print(f"Error: {err_line}")