from django.urls import path
from .views import ProcessInputView

urlpatterns = [
    path('emergencyreport/', ProcessInputView.as_view(),
         name='emergency_report'),
]
