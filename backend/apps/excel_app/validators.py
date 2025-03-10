import json
from django.core.exceptions import ValidationError


def validate_json_structure(value):
    try:
        data = json.loads(value)
    except json.JSONDecodeError:
        raise ValidationError("Неверный формат JSON")

    if not isinstance(data, list):
        raise ValidationError("Данные JSON должны быть списком")

    for item in data:
        if not isinstance(item, dict):
            raise ValidationError(
                "Каждый элемент в списке должен быть словарем")
        if 'index' not in item:
            raise ValidationError(
                "Каждый элемент должен содержать ключ 'index'")
        if not ('template' in item or 'inputKey' in item) and not (item.get(
                "tableType") == 'defects'):
            raise ValidationError(
                "Каждый элемент должен содержать либо 'template', либо 'inputKey'")

        if item.get('tableType') == 'documentation':
            required_keys = {
                "verticalGap"}
            if not required_keys.issubset(item.keys()):
                raise ValidationError(
                    f"Элементы с type='documentation' должны содержать ключи: {required_keys}")


def validate_subsections_json_structure(value):
    try:
        data = json.loads(value)
    except json.JSONDecodeError:
        raise ValidationError("Неверный формат JSON")

    if not isinstance(data, list):
        raise ValidationError("Данные JSON должны быть списком")


def validate_settings_json_structure(value, field_type):
    if field_type == 'table':
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            raise ValidationError("Неверный формат JSON")
    elif field_type == 'select':
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            raise ValidationError("Неверный формат JSON")
        if not isinstance(data,
                          dict) or 'values' not in data or not isinstance(
            data['values'], list):
            raise ValidationError(
                "Для типа 'select' поле 'settings' должно быть словарем с ключом 'values', содержащим список")
    else:
        if value is not None and value != 'null':
            raise ValidationError(
                f"Для типа '{field_type}' поле 'settings' должно быть null")
