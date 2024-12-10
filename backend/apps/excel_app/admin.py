from django.db import models
from django import forms
from django.contrib import admin
from jsoneditor.forms import JSONEditor
from .models import (Sheet, ConstructionTypes, Recommendations, Defects,
                     Materials, Fields)
from .validators import validate_json_structure, \
    validate_subsections_json_structure

from .forms import FieldsAdminForm


@admin.action(description="Скопировать выбранные объекты")
def copy_object(modeladmin, request, queryset):
    for obj in queryset:
        obj.pk = None  # Чтобы создавался новый объект, вместо обновления
        # старого
        obj.name = f'{obj.name}-копия'
        obj.save()


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


@admin.action(description="Изменить добавление в Содержание")
def change_content_section(modeladmin, request, queryset):
    for sheet in queryset:
        sheet.contentSection = not sheet.contentSection
        sheet.save()


class FieldsAdmin(admin.ModelAdmin):
    form = FieldsAdminForm
    list_display = ('name', 'step', 'position', 'required')
    actions = [toggle_required, decrease_step_value, increase_step_value,
               decrease_order_value, increase_order_value, copy_object]
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


class SheetAdmin(admin.ModelAdmin):
    form = SheetAdminForm
    list_display = ('name', 'index', 'contentSection')
    ordering = ('index',)
    actions = [change_content_section]


admin.site.register(Sheet, SheetAdmin)
admin.site.register(Recommendations)
admin.site.register(Defects)
admin.site.register(Materials)
admin.site.register(ConstructionTypes)
admin.site.register(Fields, FieldsAdmin)
