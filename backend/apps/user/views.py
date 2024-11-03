from django.contrib.auth import authenticate

from django.http import JsonResponse

from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.http import FileResponse, Http404
import os
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserInput
from .serializers import UserInputSerializer
from rest_framework import status


def default_view(request):
    return JsonResponse({"message": "User endpoint",
                         ' - /api/token/ - POST': 'to get JWT token'})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class FileUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        comment = request.data.get('comment')
        file = request.FILES.get('file')

        if file:
            file_path = os.path.join(settings.MEDIA_ROOT, 'user_files',
                                     file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

        response_data = {
            'username': username,
            'comment': comment,
            'file_name': file.name if file else None
        }

        return JsonResponse(response_data)


class ImageView(APIView):
    def get(self, request, filename, *args, **kwargs):
        file_path = os.path.join(settings.MEDIA_ROOT, 'user_files', filename)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'))
        else:
            raise Http404("Image not found")


class UserInputListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_inputs = UserInput.objects.all()
        serializer = UserInputSerializer(user_inputs, many=True)
        return Response(serializer.data)


class ProcessInputView(APIView):
    def post(self, request):
        data = request.data.get('input_data', [])
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)
        #обработка данных и вставка в Excel
        return Response({'message': 'Data processed and inserted into Excel'},
                        status=status.HTTP_200_OK)
