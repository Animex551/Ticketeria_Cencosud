from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r'usuarios', views.UsuariosViewSet)
router.register(r'zonas', views.ZonasViewSet)
router.register(r'tipo-falla', views.TipoFallaViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'adjuntos', views.AdjuntoViewSet)
router.register(r'bitacoras', views.BitacoraTicketViewSet)
router.register(r'bitacora-adjuntos', views.BitacoraAdjuntosViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='api_login'),
]

# 🎯 ESTA ES LA PARTE QUE DEBES AGREGAR AL FINAL:
# Esto permite que Django sirva los archivos subidos durante el desarrollo.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)