from django.urls import path
from .views import ProcessInputView

urlpatterns = [
    path('report/emergency/', ProcessInputView.as_view(),
         name='emergency_report'),
]
