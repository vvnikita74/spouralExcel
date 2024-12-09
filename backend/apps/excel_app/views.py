import threading
import uuid

from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework.response import Response

from .utils.report.processing import generate_report

from ..user.models import UserData


class ProcessInputView(APIView):
    def post(self, request):
        if 'Authorization' not in request.headers:
            raise AuthenticationFailed('Authorization header missing')

        data = request.data
        filename = data.pop('filename', None)
        date_created = data.pop('date_created', None)
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_data = UserData.objects.create(user=request.user, data=data,
                                            isReady=0, filename=filename,
                                            date_created=date_created)

        threading.Thread(target=self.process_data,
                         args=(data, user_data.id, filename)).start()

        return Response(user_data,
                        status=status.HTTP_200_OK)

    def process_data(self, data, user_data_id, filename):
        try:
            generate_report(data, filename)
            UserData.objects.filter(id=user_data_id).update(isReady=1,
                                                            file_name=filename)
        except Exception as e:
            print(e)
            UserData.objects.filter(id=user_data_id).update(isReady=2)
