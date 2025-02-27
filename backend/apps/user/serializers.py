from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserData, UserDataFile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.pop('refresh', None)  # Убираем refresh token
        return data


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['id', 'filename', 'reportName', 'dateCreated', 'isReady',
                  'uniqueId']


class UserDataFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDataFile
        fields = ['id', 'file', 'key']


class UserDataFullSerializer(serializers.ModelSerializer):
    files = UserDataFileSerializer(many=True, read_only=True)

    class Meta:
        model = UserData
        fields = ['id', 'filename', 'reportName', 'data', 'dateCreated',
                  'isReady', 'uniqueId', 'files']
