from django.contrib import admin
from .models import UserData
from .forms import UserDataAdminForm


class UserDataAdmin(admin.ModelAdmin):
    form = UserDataAdminForm


admin.site.register(UserData, UserDataAdmin)
