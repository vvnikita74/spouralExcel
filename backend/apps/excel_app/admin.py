from django import forms
from django.contrib import admin
from jsoneditor.forms import JSONEditor
from .models import Sheet
from .validators import validate_json_structure


class SheetAdminForm(forms.ModelForm):
    data = forms.CharField(
        initial='''[
            {
                "index": "A1",
                "merged": null,
                "cell_data": "Data for A1"
            },
            {
                "index": "B1",
                "merged": "A1",
                "cell_data": "Data for B1"
            },
            {
                "index": "C1",
                "merged": null,
                "cell_data": "Data for C1"
            }
        ]''',
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


admin.site.register(Sheet, SheetAdmin)
