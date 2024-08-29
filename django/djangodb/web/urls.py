from django.urls import path, re_path
from . import views
urlpatterns = [
    path("", views.home, name="home"),
    path("add/", views.add, name="add"),
  
    path("about/", views.about, name="about"),
    path("name=<name>", views.view, name="view"),

    path("<path:file>", views.open_file, name='open_file'),
    

  
]


"""
search page
view whole page

smiles/name/seq/id_serach = <id>

"""