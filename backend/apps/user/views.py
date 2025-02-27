import os

from django.http import FileResponse, Http404
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserData
from .serializers import CustomTokenObtainPairSerializer, UserDataSerializer, \
    UserDataFullSerializer
from ..excel_app.models import Fields
from ..excel_app.serializers import FieldsSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Кастомный класс для получения JWT токенов.
    """
    serializer_class = CustomTokenObtainPairSerializer


class MediaView(APIView):
    """
    Класс для обработки запросов на получение медиафайлов.
    """

    def get(self, request, filename):
        """
        Обрабатывает GET запрос для получения медиафайла по имени файла.

        :param request: HTTP запрос
        :param filename: Имя файла
        :return: FileResponse с медиафайлом или Http404 если файл не найден
        """
        for root, dirs, files in os.walk(settings.MEDIA_ROOT):
            if filename in files:
                file_path = os.path.join(root, filename)
                return FileResponse(open(file_path, 'rb'), as_attachment=True)
        raise Http404("Медиафайл не найден")


class UserInputListView(APIView):
    """
    Класс для получения списка пользовательских данных.
    """
    permission_classes = [IsAuthenticated]

    def get(self, _):
        """
        Обрабатывает GET запрос для получения списка пользовательских данных.

        :param _: HTTP запрос
        :return: Response с сериализованными данными
        """
        user_inputs = Fields.objects.all().order_by('step', 'position')
        serializer = FieldsSerializer(user_inputs, many=True)
        return Response(serializer.data)


class UserDataListView(APIView):
    """
    Класс для получения списка данных пользователя.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Обрабатывает GET запрос для получения списка данных пользователя.

        :param request: HTTP запрос
        :return: Response с сериализованными данными
        """
        user_data = UserData.objects.filter(user=request.user).order_by(
            '-dateCreated')
        serializer = UserDataSerializer(user_data, many=True)
        return Response(serializer.data)


class UserDataDetailView(APIView):
    """
    Класс для получения и удаления данных пользователя по ID.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Обрабатывает GET запрос для получения данных пользователя по ID.

        :param request: HTTP запрос
        :param pk: Первичный ключ данных пользователя
        :return: Response с сериализованными данными или 404 если данные не найдены
        """
        try:
            user_data = UserData.objects.get(pk=pk, user=request.user)
            serializer = UserDataFullSerializer(user_data)
            return Response(serializer.data)
        except UserData.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """
        Обрабатывает DELETE запрос для удаления данных пользователя по ID.

        :param request: HTTP запрос
        :param pk: Первичный ключ данных пользователя
        :return: Response с 204 статусом или 404 если данные не найдены
        """
        try:
            user_data = UserData.objects.get(pk=pk, user=request.user)
            user_data.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserData.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
