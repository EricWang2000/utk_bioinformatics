from django.shortcuts import render, redirect
from .models import Book
from .forms import BookForm

from django.contrib import messages

def home(request):

    all_books = Book.objects.values_list("author", flat=True).distinct()
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

def search(request,author):
    books = Book.objects.filter(author=author)
    return render(request, "search.html", {
        "author":author,
        "title":books
    })

def mol(request, pdb):
    # Example PDB file URL, you can use any valid URL or path
    pdb_url = f'https://files.rcsb.org/download/{pdb}.pdb'
    
    return render(request, 'molecular_viewer.html', {
        # 'pdb_url': pdb_url,
        "pdb" : pdb
    })
