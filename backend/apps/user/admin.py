from django.contrib import admin
from .models import CustomUser, Test

admin.site.register(CustomUser)
admin.site.register(Test)