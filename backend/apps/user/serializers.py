from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserInput


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.pop('refresh', None)  # Убираем refresh token
        return data


class UserInputSerializer(serializers.ModelSerializer):

    # related_objects = RelatedModelSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserInput
        fields = '__all__'

# For relations model
# class RelatedModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RelatedModel
#         fields = '__all__'