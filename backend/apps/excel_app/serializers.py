from rest_framework import serializers
from .models import Fields


class FieldsSerializer(serializers.ModelSerializer):
    # related_objects = RelatedModelSerializer(many=True, read_only=True)

    class Meta:
        model = Fields
        fields = '__all__'

# For relations model
# class RelatedModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RelatedModel
#         fields = '__all__'
