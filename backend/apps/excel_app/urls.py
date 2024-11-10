from django.urls import path
from .views import ProcessInputView, TaskStatusView

urlpatterns = [
    path('emergencyreport/', ProcessInputView.as_view(),
         name='emergency_report'),
path('task-status/<uuid:task_id>/', TaskStatusView.as_view(), name='task-status'),
]
