# # # Use the official Python image from Docker Hub
# FROM python:3.12-slim

# FROM ubuntu
# RUN apt-get update && \
#     apt-get install -y libmariadb-dev-compat libmariadb-dev && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*


# # set environment variables
# FROM python:3.12
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# COPY requirements.txt .

# # install python dependencies
# RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt
FROM python:3.12
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

Expose 8000
# CMD ["python", "manage.py", "runserver"]