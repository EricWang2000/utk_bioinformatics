from django import forms
from .models import AlphaSum
from django.contrib.auth.models import Group

class AlphaSum_Form(forms.ModelForm):
    class Meta:
        model = AlphaSum
        fields = ["name",
                  "group",
                  "tar_file",
                  "pdb_file",
                  "cif_file",
                  "img",
                  ]
from django.contrib.auth.models import Group

class AddGroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = ['name']
        
class JoinGroupForm(forms.Form):
    group = forms.ModelChoiceField(queryset=Group.objects.all(), label="Select a Group")


