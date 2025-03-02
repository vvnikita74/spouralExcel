from django.db import models
from django.contrib import admin
from .models import (Sheet, ConstructionTypes, Recommendations, Defects,
                     Materials, Fields)

from .forms import FieldsAdminForm, SheetAdminForm


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


@admin.action(description="Уменьшить индекс на 1 для выбранных объектов")
def decrease_index(modeladmin, request, queryset):
    queryset.update(index=models.F('index') - 1)


@admin.action(description="Увеличить индекс на 1 для выбранных объектов")
def increase_index(modeladmin, request, queryset):
    queryset.update(index=models.F('index') + 1)


@admin.action(description="Скопировать выбранные листы")
def copy_sheet(modeladmin, request, queryset):
    for sheet in queryset:
        sheet.pk = None  # Create a new object instead of updating the old one
        sheet.name = f'{sheet.name}-копия'
        sheet.save()


class FieldsAdmin(admin.ModelAdmin):
    form = FieldsAdminForm
    list_display = ('name', 'type', 'key', 'step', 'position')
    actions = [toggle_required, decrease_step_value, increase_step_value,
               decrease_order_value, increase_order_value, copy_object]
    ordering = ('step', 'position')

    class Media:
        js = ('excel_app/settings_auto/admin_custom.js',)


class SheetAdmin(admin.ModelAdmin):
    form = SheetAdminForm
    list_display = ('name', 'index', 'contentSection')
    ordering = ('index',)
    actions = [change_content_section, decrease_index, increase_index,
               copy_sheet]
    fields = ('index', 'section', 'name', 'countCell', 'data', 'subsections',
              'contentSection', 'is_appendix', 'files')
    readonly_fields = ('get_files',)

    def get_files(self, obj):
        if obj.files:
            return obj.files.url
        return "No files attached"

    get_files.short_description = 'Attached Files'


class DefectsAdmin(admin.ModelAdmin):
    list_display = ('name', 'recommendations')
    search_fields = ('name', 'recommendations__name')
    ordering = ('name',)


admin.site.register(Sheet, SheetAdmin)
admin.site.register(Recommendations)
admin.site.register(Defects, DefectsAdmin)
admin.site.register(Materials)
admin.site.register(ConstructionTypes)
admin.site.register(Fields, FieldsAdmin)
