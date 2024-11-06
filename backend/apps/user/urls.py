from django.urls import path
from .views import *

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('images/<str:filename>/', ImageView.as_view(), name='image_view'),
    path('data/', UserInputListView.as_view(), name='user_input_list'),
]
