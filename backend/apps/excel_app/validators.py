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