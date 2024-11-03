from django import forms
from jsoneditor.forms import JSONEditor
from .models import UserInput


class UserInputAdminForm(forms.ModelForm):
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
        model = UserInput
        fields = '__all__'
