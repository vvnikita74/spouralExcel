import threading
import uuid

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .utils.report_processing import generate_report

from ..user.models import UserData

class TaskManager:
    def __init__(self):
        self.tasks = {}

    def start_task(self, task_id, target, *args):
        thread = threading.Thread(target=target, args=args)
        thread.start()
        self.tasks[task_id] = {
            'status': 'Processing',
            'thread': thread
        }

    def update_task(self, task_id, status, result=None):
        if task_id in self.tasks:
            self.tasks[task_id]['status'] = status
            if result:
                self.tasks[task_id]['result'] = result

    def get_task_status(self, task_id):
        return self.tasks.get(task_id, {'status': 'Not Found'})


task_manager = TaskManager()


class ProcessInputView(APIView):
    def post(self, request):
        data = request.data
        username = request.user.username
        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_data = UserData.objects.create(user=request.user, data=data,
                                            isReady=0)

        task_id = str(uuid.uuid4())
        task_manager.start_task(task_id, self.process_data, task_id, data,
                                username,user_data.id)

        return Response({'message': 'Processing started', 'task_id': task_id},
                        status=status.HTTP_200_OK)

    def process_data(self, task_id, data, username,user_data_id):
        try:
            report_file = generate_report(data, username)
            task_manager.update_task(task_id, 'Completed', report_file)
            UserData.objects.filter(id=user_data_id).update(isReady=1)
            UserData.objects.filter(id=user_data_id).update(file_name=report_file)

        except Exception as e:
            task_manager.update_task(task_id, 'Failed', str(e))
            UserData.objects.filter(id=user_data_id).update(isReady=2)