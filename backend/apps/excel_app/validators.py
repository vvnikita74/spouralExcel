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
        if not ('template' in item or 'inputKey' in item):
            raise ValidationError(
                "Каждый элемент должен содержать либо 'template', либо 'inputKey'")

        if item.get('type') == 'documentation':
            required_keys = {"nameIndex", "yearIndex", "developerIndex",
                             "verticalGap", "lastColumn"}
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
    if field_type == 'select':
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            raise ValidationError("Неверный формат JSON")
        if not isinstance(data,
                          dict) or 'inputs' not in data or not isinstance(
                data['inputs'], list):
            raise ValidationError(
                "Для типа 'select' поле 'settings' должно быть словарем с ключом 'inputs', содержащим список")
    elif field_type == 'date':
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            raise ValidationError("Неверный формат JSON")
        if not isinstance(data, dict) or 'type' not in data:
            raise ValidationError(
                "Для типа 'date' поле 'settings' должно быть словарем с ключом 'type'")
    else:
        if value is not None and value != 'null':
            raise ValidationError(
                f"Для типа '{field_type}' поле 'settings' должно быть null")
