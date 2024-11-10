from django import forms
from jsoneditor.forms import JSONEditor
from .models import UserData


class UserDataAdminForm(forms.ModelForm):
    data = forms.CharField(
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
        model = UserData
        fields = '__all__'
