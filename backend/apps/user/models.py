import os
import shutil

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
    reportName = models.CharField(max_length=255, blank=True)
    data = models.JSONField()
    isReady = models.IntegerField(choices=STATUS_CHOICES, default=LOADING)
    dateCreated = models.DateTimeField(auto_now_add=False)

    def __str__(self):
        return f"{self.user.username} - {self.reportName}"

    def delete(self, *args, **kwargs):  # TODO Надо ли добавит удаление xlsx?
        # Удаление PDF отчета
        file_name_with_extension = self.filename if self.filename.endswith(
            '.pdf') else self.filename + '.pdf'
        report_path = os.path.join(settings.MEDIA_ROOT, 'reports',
                                   file_name_with_extension)
        if os.path.exists(report_path):
            os.remove(report_path)

        # Удаление папки файлов
        report_folder = self.filename.rsplit('.', 1)[0]
        folder_path = os.path.join(settings.MEDIA_ROOT, 'user_images',
                                   report_folder)
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        # Вызов метода delete родительского класса
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = 'Данные пользователя'
        verbose_name_plural = 'Данные пользователей'


def user_images_upload_path(instance, filename):
    report_folder = instance.user_data.filename.rsplit('.', 1)[0]
    return os.path.join('user_images', report_folder, filename)


class UserDataFile(models.Model):
    user_data = models.ForeignKey('UserData', related_name='files',
                                  on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_images_upload_path)
    key = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Изображение пользователя'
        verbose_name_plural = 'Изображения пользователей'
