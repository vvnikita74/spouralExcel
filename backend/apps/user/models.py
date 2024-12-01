import os

from django.db import models
from django.contrib.auth.models import User

from django.conf import settings


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

    def delete(self, *args, **kwargs):
        file_path = os.path.join(settings.MEDIA_ROOT, self.file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
        super().delete(*args, **kwargs)
    class Meta:
        verbose_name = 'Данные пользователя'
        verbose_name_plural = 'Данные пользователей'