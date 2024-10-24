from django.db import models
import json


class Cell:
    def __init__(self, index, merged=None, template=''):
        self.index = index
        self.merged = merged
        self.template = template

    def to_dict(self):
        return {
            'index': self.index,
            'merged': self.merged,
            'template': self.template
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            index=data['index'],
            merged=data.get('merged'),
            template=data.get('template', '')
        )


class Sheet(models.Model):
    index = models.IntegerField()
    data = models.JSONField()

    def set_data(self, cells):
        self.data = json.dumps([cell.to_dict() for cell in cells])

    def get_data(self):
        cell_dicts = json.loads(self.data)
        return [Cell.from_dict(cell_dict) for cell_dict in cell_dicts]


class Recommendations(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Defects(models.Model):
    name = models.CharField(max_length=255, unique=True)
    recommendations = models.OneToOneField('Recommendations', to_field='name',
                                           on_delete=models.CASCADE,
                                           related_name='+')

    def __str__(self):
        return self.name


class Materials(models.Model):
    name = models.CharField(max_length=255, unique=True)
    defects = models.ManyToManyField('Defects')
    recommendations = models.ManyToManyField('Recommendations')

    def __str__(self):
        return self.name


class ConstructionTypes(models.Model):
    name = models.CharField(max_length=255, unique=True)
    material = models.ManyToManyField('Materials')

    def __str__(self):
        return self.name
