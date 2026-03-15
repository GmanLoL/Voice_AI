from django.db import models

class User(models.Model):
    login = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    admin = models.BooleanField(default=False)

    def __str__(self):
        return self.login