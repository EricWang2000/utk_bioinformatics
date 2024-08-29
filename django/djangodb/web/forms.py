from django import forms
from .models import AlphaSum

class AlphaSum_Form(forms.ModelForm):
    class Meta:
        model = AlphaSum
        fields = ["name",
                  "tar_file",
                  "pdb_file",
                  "cif_file",
                  "img",
                  ]
