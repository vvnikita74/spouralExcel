from django.urls import path
from .views import *

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('media/<str:filename>/', MediaView.as_view(), name='image_view'),
    path('data/', UserInputListView.as_view(), name='user_input_list'),
    path('user/data/', UserDataListView.as_view(), name='user_data_list'),
    path('user/data/<int:pk>/', UserDataDetailView.as_view(),
         name='user_data_detail'),
]
