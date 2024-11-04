from django.urls import path
from .views import *

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/images/<str:filename>/', ImageView.as_view(), name='image_view'),
    path('api/data/', UserInputListView.as_view(), name='user_input_list'),
]
