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
        
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)
        username = request.user.username
        user_data = UserData.objects.create(user=request.user, data=data,
                                            isReady=0)

        threading.Thread(target=self.process_data,
                         args=(data, username, user_data.id)).start()

        return Response({'message': 'Processing started'},
                        status=status.HTTP_200_OK)

    def process_data(self, data, username, user_data_id):
        try:
            report_file = generate_report(data, username)
            UserData.objects.filter(id=user_data_id).update(isReady=1,
                                                            file_name=report_file)
        except Exception as e:
            print(e)
            UserData.objects.filter(id=user_data_id).update(isReady=2)
