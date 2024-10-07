from django.urls import path, re_path, include
from . import views

urlpatterns = [
    # path("admin/")
    path("", views.home, name="home"),
    path("add/", views.add, name="add"),
    path("add-group/", views.add_group, name='add_group'),
    path("join-group/", views.join_group, name='join_group'),
    path("my-group/", views.group_list, name='group_list'),
    path('task/<str:task_id>', views.get_task_status, name='get_task_status'),
    path("name=<name>", views.view, name="view"),
    path("download/<file>", views.download_file, name="download"),
    # path("about/", views.about, name="about"),
    

    path("<path:file>", views.open_file, name='open_file'),

]
