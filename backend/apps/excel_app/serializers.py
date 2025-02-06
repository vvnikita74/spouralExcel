from rest_framework import serializers
from .models import Fields, Recommendations
from .models import ConstructionTypes, Materials, Defects


class DefectRecommendationSerializer(serializers.Serializer):
    def_name = serializers.CharField(source='name')
    rec_name = serializers.CharField(source='recommendations.name')


class MaterialSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField()

    class Meta:
        model = Materials
        fields = ['name', 'values']

    def get_values(self, obj):
        values = []
        for defect in obj.defects.all():
            rec_name = defect.recommendations.name if defect.recommendations else ''
            values.append({
                'def': defect.name,
                'rec': rec_name
            })
        return values


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
