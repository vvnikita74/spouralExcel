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
    filename = models.CharField(max_length=255)
    data = models.JSONField()
    isReady = models.IntegerField(choices=STATUS_CHOICES, default=LOADING)
    dateCreated = models.DateTimeField(auto_now_add=False)

    def __str__(self):
        return f"{self.user.username} - {self.data}"

    def delete(self, *args, **kwargs):
        # Ensure the file name includes the correct extension
        file_name_with_extension = self.filename if self.filename.endswith(
            '.pdf') else self.filename + '.pdf'

        # Construct the file path
        file_path = os.path.join(settings.MEDIA_ROOT, 'reports',
                                 file_name_with_extension)

        # Check if the file exists and delete it
        if os.path.exists(file_path):
            os.remove(file_path)

        # Call the superclass delete method
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = 'Данные пользователя'
        verbose_name_plural = 'Данные пользователей'
