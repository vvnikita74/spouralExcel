from django.contrib import admin
from .models import UserData
from .forms import UserDataAdminForm


class UserDataAdmin(admin.ModelAdmin):
    form = UserDataAdminForm
    list_display = ('get_username', 'date_created', 'isReady')
    ordering = ('-date_created',)

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'


admin.site.register(UserData, UserDataAdmin)
