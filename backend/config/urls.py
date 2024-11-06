from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

urlpatterns = [
                  path('',
                       RedirectView.as_view(url='/admin/', permanent=True)),
                  path('api/', include('apps.user.urls')),
                  path('api/', include('apps.excel_app.urls')),
                  path('admin/', admin.site.urls),
              ] + static(settings.MEDIA_URL,
                         document_root=settings.MEDIA_ROOT)
