from rest_framework import serializers
from .models import Fields

class FieldsSerializer(serializers.ModelSerializer):
    settings = serializers.JSONField()

class FieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fields
        fields = '__all__'
        list_serializer_class = FieldsSerializer
