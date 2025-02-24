import os
import threading
from io import BytesIO

from PIL import Image
from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from dateutil import parser
from transliterate import translit

from .utils.report.processing import generate_report

from ..user.models import UserData, UserDataFile
from ..user.serializers import UserDataSerializer


class ProcessInputView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if 'Authorization' not in request.headers:
            raise AuthenticationFailed('Authorization header missing')

        data = request.data.dict()
        filename = data.pop('filename', None)
        uniqueId = data.pop('uniqueId', None)
        files = request.FILES
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        if isinstance(filename, list):
            filename = filename[0]
        for key in files.keys():
            data.pop(key, None)
        report_name = filename
        filename = translit(filename, language_code='ru',
                            reversed=True).replace(' ', '-')
        if uniqueId:
            user_data = UserData.objects.create(user=request.user, data=data,
                                                isReady=0, filename=filename,
                                                reportName=report_name,
                                                uniqueId=uniqueId)
        else:
            user_data = UserData.objects.create(user=request.user, data=data,
                                                isReady=0, filename=filename,
                                                reportName=report_name)
        user_files = []
        for key, file_list in files.lists():
            for file in file_list:
                compressed_file = self.compress_image(file)
                user_data_file = UserDataFile.objects.create(
                    user_data=user_data,
                    file=compressed_file, key=key)
                user_files.append(
                    {'key': key, 'path': user_data_file.file.path})
                user_data.data[key] = os.path.basename(compressed_file.name)
        user_data.save()
        threading.Thread(target=self.process_data,
                         args=(data, user_data.id, filename,
                               user_files)).start()

        serializer = UserDataSerializer(user_data)
        response_data = serializer.data
        return Response(response_data,
                        status=status.HTTP_200_OK)

    def compress_image(self, uploaded_file):
        image = Image.open(uploaded_file)
        image_io = BytesIO()
        image.save(image_io, format='WEBP', quality=60)
        new_filename = uploaded_file.name.rsplit('.', 1)[0] + '.webp'
        compressed_image = ContentFile(image_io.getvalue(), name=new_filename)
        return compressed_image

    @staticmethod
    def process_data(data, user_data_id, filename, user_files=None):
        try:
            generate_report(data, filename, user_files)
            UserData.objects.filter(id=user_data_id).update(isReady=1,
                                                            filename=filename)
        except Exception as e:
            print(e)
            UserData.objects.filter(id=user_data_id).update(isReady=2)
