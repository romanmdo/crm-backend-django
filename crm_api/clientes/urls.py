from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet

router = DefaultRouter() # Creamos instancia
router.register('clientes', ClienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]