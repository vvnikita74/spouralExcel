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