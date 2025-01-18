from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

api_patterns = [
    path('', include('apps.user.urls')),
    path('', include('apps.excel_app.urls')),
]

urlpatterns = ([
                   path('',
                        RedirectView.as_view(url='/admin/', permanent=True)),
                   path('api/', include(api_patterns)),
                   path('admin/', admin.site.urls),
               ]
               + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
               + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
