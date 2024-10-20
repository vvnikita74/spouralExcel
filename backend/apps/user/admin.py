from django.contrib import admin

from .models import UserData, UserInput

admin.site.register(UserData)
admin.site.register(UserInput)
