from django.urls import path
from .views import default_view, CustomTokenObtainPairView, FileUploadView, \
    LoginView, ImageView

urlpatterns = [
    path('', default_view, name='default_view'),
    path('api/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/upload/', FileUploadView.as_view(), name='file_upload'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/images/<str:filename>/', ImageView.as_view(), name='image_view'),
]
