from django import forms
from django.contrib import admin
from jsoneditor.forms import JSONEditor
from .models import (Sheet, ConstructionTypes, Recommendations, Defects,
                     Materials, Fields)
from .validators import validate_json_structure

from .forms import FieldsAdminForm


class FieldsAdmin(admin.ModelAdmin):
    form = FieldsAdminForm


class SheetAdminForm(forms.ModelForm):
    data = forms.CharField(
        initial='''[
    {
        "index": "A1",
        "merged": null,
        "template": "template string",
        "inputKey": "inputKey"
    },
    {
        "index": "B1",
        "merged": "C1",
        "template": "template string",
        "inputKey": "inputKey"
    }
]]''',
        widget=JSONEditor(attrs={
            'options': {
                'mode': 'code',
                'ace': {
                    'useWorker': False
                }
            }
        }),
        validators=[validate_json_structure]
    )

    class Meta:
        model = Sheet
        fields = '__all__'


class SheetAdmin(admin.ModelAdmin):
    form = SheetAdminForm
    list_display = ('name', 'index')
    ordering = ('index',)


admin.site.register(Sheet, SheetAdmin)
admin.site.register(Recommendations)
admin.site.register(Defects)
admin.site.register(Materials)
admin.site.register(ConstructionTypes)
admin.site.register(Fields,FieldsAdmin)
