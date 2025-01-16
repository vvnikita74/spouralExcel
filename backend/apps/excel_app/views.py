import threading
import uuid
from django.http import QueryDict
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response
from dateutil import parser
from .utils.report.processing import generate_report

from ..user.models import UserData
from ..user.serializers import UserDataSerializer


class ProcessInputView(APIView):
    def post(self, request):
        if 'Authorization' not in request.headers:
            raise AuthenticationFailed('Authorization header missing')

        data = request.data.copy()
        filename = data.pop('filename', None)
        date_created_str = data.pop('dateCreated', None)
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        if isinstance(filename, list):
            filename = filename[0]
        if isinstance(date_created_str, list):
            date_created_str = date_created_str[0]
        date_created = parser.parse(
            date_created_str) if date_created_str else None
        user_data = UserData.objects.create(user=request.user, data=data,
                                            isReady=0, file_name=filename,
                                            date_created=date_created)

        threading.Thread(target=self.process_data,
                         args=(data, user_data.id, filename)).start()

        serializer = UserDataSerializer(user_data)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)

    @staticmethod
    def process_data(data, user_data_id, filename):
        try:
            generate_report(data, filename)
            UserData.objects.filter(id=user_data_id).update(isReady=1,
                                                            file_name=filename)
        except Exception as e:
            print(e)
            UserData.objects.filter(id=user_data_id).update(isReady=2)
