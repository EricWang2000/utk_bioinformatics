from django.shortcuts import render, redirect
from .models import Book
from .forms import BookForm
from django.contrib import messages

def home(request):

    all_books = Book.objects.all
    return render(request, "home.html", {"all":all_books})

def join(request):
    
    if request.method == "POST":
        form = BookForm(request.POST or None)
        if form.is_valid():
            title = form.cleaned_data['title']
            if not Book.objects.filter(title=title).exists():
                form.save()
                messages.success(request, ("Added!"))
            else:
                messages.error(request, ("Already Added!"))
                return redirect("home")
        else:
            title = request.POST["title"]
            author = request.POST["author"]
            messages.error(request, ("Missing Entries"))
            return render(request, "join.html", {"title":title, "author":author})
        return redirect("home")
    else:
        return render(request, "join.html", {})

