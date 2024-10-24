from django.db import models
from django.contrib.auth.models import User


class UserData(models.Model):
    LOADING = 0
    SUCCESS = 1
    ERROR = 2

    STATUS_CHOICES = [
        (LOADING, 'Loading'),
        (SUCCESS, 'Success'),
        (ERROR, 'Error'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    data = models.JSONField()
    isReady = models.IntegerField(choices=STATUS_CHOICES, default=LOADING)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.data}"


class UserInput(models.Model):
    TEXT = 'text'
    NUMBER = 'number'
    EMAIL = 'email'
    DATE = 'date'
    CHOICES = [
        (TEXT, 'Text'),
        (NUMBER, 'Number'),
        (EMAIL, 'Email'),
        (DATE, 'Date'),
    ]
    # изменить choices на нужные нам
    type = models.CharField(max_length=10, choices=CHOICES)
    key = models.CharField(max_length=255, unique=True)
    mask = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255)
    construction_type = models.OneToOneField('excel_app.ConstructionTypes',
                                             to_field='name',
                                             on_delete=models.SET_NULL,
                                             blank=True, null=True)

    def __str__(self):
        return self.name
