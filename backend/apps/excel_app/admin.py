import json

from django.db import models
from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from jsoneditor.forms import JSONEditor
from .models import (Sheet, ConstructionTypes, Recommendations, Defects,
                     Materials, Fields)
from .validators import validate_json_structure

from .forms import FieldsAdminForm


@admin.action(description='Изменить обязательность')
def toggle_required(modeladmin, request, queryset):
    for field in queryset:
        field.required = not field.required
        field.save()


@admin.action(
    description="Уменьшить значение шага на 1 для выбранных объектов")
def decrease_step_value(modeladmin, request, queryset):
    queryset.update(step=models.F('step') - 1)


@admin.action(
    description="Увеличить значение шага на 1 для выбранных объектов")
def increase_step_value(modeladmin, request, queryset):
    queryset.update(step=models.F('step') + 1)


@admin.action(
    description="Уменьшить значение порядка на 1 для выбранных объектов")
def decrease_order_value(modeladmin, request, queryset):
    queryset.update(position=models.F('position') - 1)


@admin.action(
    description="Увеличить значение порядка на 1 для выбранных объектов")
def increase_order_value(modeladmin, request, queryset):
    queryset.update(position=models.F('position') + 1)


class FieldsAdmin(admin.ModelAdmin):
    form = FieldsAdminForm
    list_display = ('name', 'step', 'position', 'required')
    actions = [toggle_required, decrease_step_value, increase_step_value,
               decrease_order_value, increase_order_value]
    ordering = ('step', 'position')


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

    class Meta:
        model = Sheet
        fields = '__all__'

    def clean_data(self):
        data = self.cleaned_data['data']
        cells = json.loads(data)
        for cell in cells:
            cell_type = cell.get('type')
            example = cell.get('example')
            if cell_type in ['documentation', 'conclusion',
                             'defects'] and not example:
                raise ValidationError(f"Поле 'example' обязательно, "
                                      f"когда тип ячейки '{cell_type}'")
        return data


class SheetAdmin(admin.ModelAdmin):
    form = SheetAdminForm
    list_display = ('name', 'index')
    ordering = ('index',)


admin.site.register(Sheet, SheetAdmin)
admin.site.register(Recommendations)
admin.site.register(Defects)
admin.site.register(Materials)
admin.site.register(ConstructionTypes)
admin.site.register(Fields, FieldsAdmin)
