import json
from django.core.exceptions import ValidationError

def validate_json_structure(value):
    try:
        data = json.loads(value)
    except json.JSONDecodeError:
        raise ValidationError("Invalid JSON format")

    if not isinstance(data, list):
        raise ValidationError("JSON data must be a list")

    required_keys = {"index", "template"}
    for item in data:
        if not isinstance(item, dict):
            raise ValidationError("Each item in the list must be a dictionary")
        if not required_keys.issubset(item.keys()):
            raise ValidationError(f"Each item must contain keys: {required_keys}")