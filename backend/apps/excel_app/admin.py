from django import forms
from django.contrib import admin
from jsoneditor.forms import JSONEditor
from .models import Sheet


class SheetAdminForm(forms.ModelForm):
    class Meta:
        model = Sheet
        fields = '__all__'
        widgets = {
            'data': JSONEditor(attrs={'options': {'mode': 'code'}}),
        }


class SheetAdmin(admin.ModelAdmin):
    form = SheetAdminForm


admin.site.register(Sheet, SheetAdmin)
