from rest_framework import serializers
from .models import Fields, Recommendations
from .models import ConstructionTypes, Materials, Defects


class MaterialSerializer(serializers.ModelSerializer):
    defects = serializers.StringRelatedField(many=True)
    recs = serializers.StringRelatedField(many=True, source='recommendations')

    class Meta:
        model = Materials
        fields = ['name', 'defects', 'recs']


class ConstructionTypeSerializer(serializers.ModelSerializer):
    materials = MaterialSerializer(many=True, source='material')

    class Meta:
        model = ConstructionTypes
        fields = ['name', 'materials']


class FieldsSerializer(serializers.ModelSerializer):
    settings = serializers.JSONField()
    construction_type = ConstructionTypeSerializer()

    class Meta:
        model = Fields
        fields = '__all__'
