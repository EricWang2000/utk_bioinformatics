from django.db import models
from django.contrib.auth.models import Group

class AlphaSum(models.Model):

    name = models.CharField(max_length=50)
    group = models.OneToOneField(Group, on_delete=models.CASCADE, blank=True, null=True)
    fasta_file = models.FileField(upload_to="uploads/fasta", blank=True, null=True)
    unzipped = models.FileField(upload_to="uploads/unzipped", blank=True, null=True)
    tar_file = models.FileField(upload_to="uploads/tar", blank=True, null=True)
    pdb_file = models.FileField(upload_to="uploads/pdb", blank=True, null=True)
    cif_file = models.FileField(upload_to="uploads/cif", blank=True, null=True)
    img = models.ImageField(upload_to="uploads/img", blank=True, null=True)

    def __str__(self):
        return self.name

