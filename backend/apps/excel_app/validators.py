import json
from django.core.exceptions import ValidationError

def validate_json_structure(value):
    try:
        data = json.loads(value)
    except json.JSONDecodeError:
        raise ValidationError("Неверный формат JSON")

    if not isinstance(data, list):
        raise ValidationError("Данные JSON должны быть списком")

    required_keys = {"index", "template"}
    for item in data:
        if not isinstance(item, dict):
            raise ValidationError("Каждый элемент в списке должен быть словарем")
        if not required_keys.issubset(item.keys()):
            raise ValidationError(f"Каждый элемент должен содержать ключи: {required_keys}")
        if 'type' not in item and not ('template' in item or 'inputKey' in item):
            raise ValidationError("Если 'type' отсутствует, должен присутствовать либо 'template', либо 'inputKey'")