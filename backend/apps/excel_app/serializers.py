from collections import defaultdict

from rest_framework import serializers
from .models import Fields


class NestedFieldsSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        grouped_data = defaultdict(list)
        for item in data:
            grouped_data[item.step].append(item)
        return [super(NestedFieldsSerializer, self).to_representation(group)
                for group in grouped_data.values()]


class FieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fields
        fields = '__all__'
        list_serializer_class = NestedFieldsSerializer
