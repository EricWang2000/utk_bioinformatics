from django.urls import path
from . import views
urlpatterns = [
    path("", views.home, name = "home"),
    path("join/", views.join, name = "join"),
    path("search_author/<author>", views.search,  name="search"),
    path("mol/<pdb>", views.mol, name="mol"),
   

]
