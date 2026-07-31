from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, FacturaViewSet

router = DefaultRouter() # Creamos instancia
router.register('clientes', ClienteViewSet)
router.register('facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]