from django.contrib import admin
from .models import UserData, UserDataFile
from .forms import UserDataAdminForm


class UserDataFileInline(admin.TabularInline):
    model = UserDataFile
    extra = 0


class UserDataAdmin(admin.ModelAdmin):
    form = UserDataAdminForm
    list_display = ('get_username', 'dateCreated', 'isReady')
    ordering = ('-dateCreated',)
    inlines = [UserDataFileInline]

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'


class UserFilesAdmin(admin.ModelAdmin):
    list_display = ('user_data_id', 'file', 'key')
    ordering = ('user_data',)


admin.site.register(UserData, UserDataAdmin)
admin.site.register(UserDataFile, UserFilesAdmin)
