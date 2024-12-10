import json
from django.db import models


class Fields(models.Model):
    TEXT = 'text'
    NUMBER = 'number'
    SELECT = 'select'
    MULTISELECT = 'multiselect'
    MULTINUMBER = 'multinumber'
    DOCUMENTATION = 'documentation'
    DATE = 'date'
    BOOL = 'bool'
    CHOICES = [
        (TEXT, 'Text'),
        (NUMBER, 'Number'),
        (DATE, 'Date'),
        (SELECT, 'Select'),
        (MULTISELECT, 'MultiSelect'),
        (MULTINUMBER, 'MultiNumber'),
        (DOCUMENTATION, 'Documentation'),
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
    def __init__(self, index, template='', type=None, inputKey=None,
                 defaultValue=None, nameIndex=None, yearIndex=None,
                 developerIndex=None, verticalGap=None, lastColumn=None):
        self.index = index
        self.template = template
        self.type = type
        self.inputKey = inputKey
        self.defaultValue = defaultValue
        self.nameIndex = nameIndex
        self.yearIndex = yearIndex
        self.developerIndex = developerIndex
        self.verticalGap = verticalGap
        self.lastColumn = lastColumn

    def to_dict(self):
        return {
            'index': self.index,
            'template': self.template,
            'type': self.type,
            'inputKey': self.inputKey,
            'defaultValue': self.defaultValue,
            'nameIndex': self.nameIndex,
            'yearIndex': self.yearIndex,
            'developerIndex': self.developerIndex,
            'verticalGap': self.verticalGap,
            'lastColumn': self.lastColumn
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            index=data['index'],
            template=data.get('template'),
            type=data.get('type', None),
            inputKey=data.get('inputKey', ''),
            defaultValue=data.get('defaultValue', ''),
            nameIndex=data.get('nameIndex', None),
            yearIndex=data.get('yearIndex', None),
            developerIndex=data.get('developerIndex', None),
            verticalGap=data.get('verticalGap', None),
            lastColumn=data.get('lastColumn', None)
        )


class Sheet(models.Model):
    index = models.IntegerField()
    section = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255)
    countCell = models.CharField(max_length=10, default='AK56', null=True,
                                 blank=True)
    data = models.JSONField()
    subsections = models.JSONField(blank=True, null=True, default=list)
    contentSection = models.BooleanField(default=False)

    def set_data(self, cells):
        self.data = json.dumps([cell.to_dict() for cell in cells])

    def get_data(self):
        cell_dicts = json.loads(self.data)
        return [Cell.from_dict(cell_dict) for cell_dict in cell_dicts]

    class Meta:
        verbose_name = 'Лист'
        verbose_name_plural = 'Листы'


class Recommendations(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Рекомендация'
        verbose_name_plural = 'Рекомендации'


class Defects(models.Model):
    name = models.CharField(max_length=255, unique=True)
    recommendations = models.OneToOneField('Recommendations', to_field='name',
                                           on_delete=models.CASCADE,
                                           related_name='+')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Дефект'
        verbose_name_plural = 'Дефекты'


class Materials(models.Model):
    name = models.CharField(max_length=255, unique=True)
    defects = models.ManyToManyField('Defects')
    recommendations = models.ManyToManyField('Recommendations')

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
