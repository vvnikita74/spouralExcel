from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserData


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.pop('refresh', None)  # Убираем refresh token
        return data


# For relations model
# class RelatedModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RelatedModel
#         fields = '__all__'


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['filename', 'dateCreated', 'isReady']
