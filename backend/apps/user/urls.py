from django.urls import path
from .views import default_view, CustomTokenObtainPairView, FileUploadView, \
    LoginView

urlpatterns = [
    path('', default_view, name='default_view'),
    path('api/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/upload/', FileUploadView.as_view(), name='file_upload'),
    path('api/login/', LoginView.as_view(), name='login'),
]
