from django.contrib import admin
from .models import UserData, UserInput
from .forms import UserInputAdminForm


class UserInputAdmin(admin.ModelAdmin):
    form = UserInputAdminForm


admin.site.register(UserData)
admin.site.register(UserInput, UserInputAdmin)
