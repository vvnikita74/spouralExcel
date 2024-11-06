from django import forms
from jsoneditor.forms import JSONEditor
from .models import Fields


class FieldsAdminForm(forms.ModelForm):
    settings = forms.CharField(
        widget=JSONEditor(attrs={
            'options': {
                'mode': 'code',
                'ace': {
                    'useWorker': False
                }
            }
        })
    )

    class Meta:
        model = Fields
        fields = '__all__'
