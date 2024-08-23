from django.db import models

class Book(models.Model):
    author = models.CharField(max_length=50)
    title = models.CharField(max_length=50, default=None)

    def __str__(self):
        return self.title