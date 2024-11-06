import os

from django.http import FileResponse, Http404, JsonResponse
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserData
from .serializers import CustomTokenObtainPairSerializer
from ..excel_app.models import Fields
from ..excel_app.serializers import FieldsSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ImageView(APIView):
    def get(self, _, filename):
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'))
        else:
            raise Http404("Image not found")


class UserInputListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _):
        user_inputs = Fields.objects.all()
        serializer = FieldsSerializer(user_inputs, many=True)
        return Response(serializer.data)