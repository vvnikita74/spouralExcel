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
        date_created_str = data.pop('dateCreated', None)
        files = request.FILES
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        if isinstance(filename, list):
            filename = filename[0]
        if isinstance(date_created_str, list):
            date_created_str = date_created_str[0]
        date_created = parser.parse(
            date_created_str) if date_created_str else None
        for key in files.keys():
            data.pop(key, None)
        user_data = UserData.objects.create(user=request.user, data=data,
                                            isReady=0, filename=filename,
                                            dateCreated=date_created)

        for key, file_list in files.lists():
            for file in file_list:
                compressed_file = self.compress_image(file)
                UserDataFile.objects.create(user_data=user_data,
                                            file=compressed_file, key=key)

        threading.Thread(target=self.process_data,
                         args=(data, user_data.id, filename)).start()

        serializer = UserDataSerializer(user_data)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)

    def compress_image(self, uploaded_file):
        image = Image.open(uploaded_file)
        image_io = BytesIO()
        image.save(image_io, format='WEBP', quality=60)
        new_filename = uploaded_file.name.rsplit('.', 1)[0] + '.webp'
        compressed_image = ContentFile(image_io.getvalue(), name=new_filename)
        return compressed_image

    @staticmethod
    def process_data(data, user_data_id, filename):
        try:
            generate_report(data, filename)
            UserData.objects.filter(id=user_data_id).update(isReady=1,
                                                            filename=filename)
        except Exception as e:
            print(e)
            UserData.objects.filter(id=user_data_id).update(isReady=2)
