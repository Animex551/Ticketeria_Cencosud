from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # Corrige esta línea: debe ser admin.site.urls
    path('admin/', admin.site.urls), 
    path('api/', include('mi_api.urls')),
    # El esquema en formato YAML/JSON
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # La interfaz Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # La interfaz ReDoc
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)