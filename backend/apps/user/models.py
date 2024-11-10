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
    file_name = models.CharField(max_length=255)
    data = models.JSONField()
    isReady = models.IntegerField(choices=STATUS_CHOICES, default=LOADING)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.data}"

    class Meta:
        verbose_name = 'Данные пользователя'
        verbose_name_plural = 'Данные пользователей'


class UserInput(models.Model):
    TEXT = 'text'
    NUMBER = 'number'
    SELECT = 'select'
    MULTISELECT = 'multiselect'
    MULTINUMBER = 'multinumber'
    DOCUMENTATION = 'documentation'
    DATE = 'date'
    CHOICES = [
        (TEXT, 'Text'),
        (NUMBER, 'Number'),
        (DATE, 'Date'),
        (SELECT, 'Select'),
        (MULTISELECT, 'MultiSelect'),
        (MULTINUMBER, 'MultiNumber'),
        (DOCUMENTATION, 'Documentation'),
    ]
    type = models.CharField(max_length=15, choices=CHOICES)
    key = models.CharField(max_length=255, unique=True)
    mask = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, null=True, blank=True)
    settings = models.JSONField(blank=True, null=True)
    construction_type = models.OneToOneField('excel_app.ConstructionTypes',
                                             to_field='name',
                                             on_delete=models.SET_NULL,
                                             blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Поле'
        verbose_name_plural = 'Поля'
