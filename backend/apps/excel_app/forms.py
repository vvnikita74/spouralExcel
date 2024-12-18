from django import forms
from jsoneditor.forms import JSONEditor
from .models import Fields, Sheet
from .validators import validate_settings_json_structure, \
    validate_subsections_json_structure, validate_json_structure


class FieldsAdminForm(forms.ModelForm):
    settings = forms.CharField(
        initial='''{
    "inputs": [
        {
            "name": "input name",
            "placeholder": "input placeholder",
            "type": "text"
        }
    ]
}''',
        widget=JSONEditor(attrs={
            'options': {
                'mode': 'code',
                'ace': {
                    'useWorker': False
                }
            }
        }),
        validators=[validate_settings_json_structure]
    )

    class Meta:
        model = Fields
        fields = '__all__'


class SheetAdminForm(forms.ModelForm):
    data = forms.CharField(
        initial='''[
    {
        "index": "cellIndex",
        "template": "template string",
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
    subsections = forms.CharField(
        initial='''[
        {
            "sectionId": "id string",
            "sectionName": "name string",
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
        validators=[validate_subsections_json_structure]
    )

    class Meta:
        model = Sheet
        fields = '__all__'
