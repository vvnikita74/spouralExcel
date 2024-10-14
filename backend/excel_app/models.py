from django.db import models
import json


class Cell:
    def __init__(self, index, merged=None, cell_data=''):
        self.index = index
        self.merged = merged
        self.cell_data = cell_data

    def to_dict(self):
        return {
            'index': self.index,
            'merged': self.merged,
            'cell_data': self.cell_data
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            index=data['index'],
            merged=data.get('merged'),
            cell_data=data.get('cell_data', '')
        )


class Sheet(models.Model):
    index = models.IntegerField()
    data = models.JSONField()

    def set_data(self, cells):
        self.data = json.dumps([cell.to_dict() for cell in cells])

    def get_data(self):
        cell_dicts = json.loads(self.data)
        return [Cell.from_dict(cell_dict) for cell_dict in cell_dicts]
