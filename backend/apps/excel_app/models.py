import json
import os

from django.db import models
from django.utils.text import slugify
from unidecode import unidecode


class Fields(models.Model):
    TEXT = 'text'
    NUMBER = 'number'
    SELECT = 'select'
    MULTISELECT = 'multiselect'
    MULTINUMBER = 'multinumber'
    TABLE = 'table'
    DATE = 'date'
    BOOL = 'bool'
    CHOICES = [
        (TEXT, 'Text'),
        (NUMBER, 'Number'),
        (DATE, 'Date'),
        (SELECT, 'Select'),
        (MULTISELECT, 'MultiSelect'),
        (MULTINUMBER, 'MultiNumber'),
        (TABLE, 'Table'),
        (BOOL, 'Bool')
    ]
    type = models.CharField(max_length=15, choices=CHOICES)
    key = models.CharField(max_length=255, unique=True)
    mask = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, null=True, blank=True)
    settings = models.JSONField(blank=True, null=True)
    construction_type = models.OneToOneField('excel_app.ConstructionTypes',
                                             to_field='name',
                                             on_delete=models.SET_NULL,
                                             blank=True, null=True)
    step = models.IntegerField(default=0)
    position = models.IntegerField(default=0)
    required = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Поле'
        verbose_name_plural = 'Поля'


class Cell:
    def __init__(self, index, template='', tableType=None, inputKey=None,
                 defaultValue=None, verticalGap=None, cells=None,
                 listsCell=None):
        self.index = index
        self.template = template
        self.tableType = tableType
        self.inputKey = inputKey
        self.defaultValue = defaultValue
        self.verticalGap = verticalGap
        self.cells = cells if cells is not None else []
        self.listsCell = listsCell

    def to_dict(self):
        return {
            'index': self.index,
            'template': self.template,
            'tableType': self.tableType,
            'inputKey': self.inputKey,
            'defaultValue': self.defaultValue,
            'verticalGap': self.verticalGap,
            'cells': self.cells,
            'listsCell': self.listsCell
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            index=data.get('index'),
            template=data.get('template'),
            tableType=data.get('tableType', None),
            inputKey=data.get('inputKey', ''),
            defaultValue=data.get('defaultValue', ''),
            verticalGap=data.get('verticalGap', None),
            cells=data.get('cells', []),
            listsCell=data.get('listsCell', None)
        )

    def __str__(self):
        return f"Cell(index={self.index}, template={self.template}, tableType={self.tableType}, inputKey={self.inputKey}, defaultValue={self.defaultValue}, verticalGap={self.verticalGap}, cells={self.cells}, listsCell={self.listsCell})"


def sheet_upload_to(instance, filename):
    # Slugify the sheet name to create a valid directory name
    sheet_name = slugify(unidecode(instance.name))
    return os.path.join('sheets', sheet_name, filename)


class Sheet(models.Model):
    index = models.IntegerField()
    section = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255)
    countCell = models.CharField(max_length=10, default='AK56', null=True,
                                 blank=True)
    data = models.JSONField()
    subsections = models.JSONField(blank=True, null=True, default=list)
    contentSection = models.BooleanField(default=False)
    files = models.FileField(upload_to=sheet_upload_to, blank=True,
                             null=True)

    def set_data(self, cells):
        self.data = json.dumps([cell.to_dict() for cell in cells])

    def get_data(self):
        cell_dicts = json.loads(self.data)
        return [Cell.from_dict(cell_dict) for cell_dict in cell_dicts]

    def get_files(self):
        return self.files.all()

    def __str__(self):
        return f'{self.name}, {self.index}'

    class Meta:
        verbose_name = 'Лист'
        verbose_name_plural = 'Листы'


class Recommendations(models.Model): # TODO изменение в админке срет ошибку
    # исправить
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Рекомендация'
        verbose_name_plural = 'Рекомендации'


class Defects(models.Model):
    name = models.CharField(max_length=255, unique=True)
    recommendations = models.ForeignKey('Recommendations', to_field='name',
                                           on_delete=models.PROTECT,
                                           related_name='defects', null=True,
                                           blank=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Дефект'
        verbose_name_plural = 'Дефекты'


class Materials(models.Model):
    name = models.CharField(max_length=255, unique=True)
    defects = models.ManyToManyField('Defects')
    recommendations = models.ManyToManyField('Recommendations', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'


class ConstructionTypes(models.Model):
    name = models.CharField(max_length=255, unique=True)
    material = models.ManyToManyField('Materials')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип конструкции'
        verbose_name_plural = 'Типы конструкций'
