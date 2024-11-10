import os

from django.http import FileResponse, Http404
from django.conf import settings

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomTokenObtainPairSerializer
from ..excel_app.models import Fields
from ..excel_app.serializers import FieldsSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MediaView(APIView):
    def get(self, request, filename):
        for root, dirs, files in os.walk(settings.MEDIA_ROOT):
            if filename in files:
                file_path = os.path.join(root, filename)
                return FileResponse(open(file_path, 'rb'), as_attachment=True)
        raise Http404("Media not found")


class UserInputListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _):
        user_inputs = Fields.objects.all().order_by('step', 'position')
        serializer = FieldsSerializer(user_inputs, many=True)
        return Response(serializer.data)
