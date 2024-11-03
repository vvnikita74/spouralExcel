from django.urls import path
from .views import default_view, CustomTokenObtainPairView, FileUploadView, \
    ImageView, UserInputListView

urlpatterns = [
    path('', default_view, name='default_view'),
    path('api/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/upload/', FileUploadView.as_view(), name='file_upload'),
    path('api/images/<str:filename>/', ImageView.as_view(), name='image_view'),
    path('api/data/', UserInputListView.as_view(), name='user_input_list'),
]
