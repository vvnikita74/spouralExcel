from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.views import APIView
import os
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


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


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False}, status=401)
