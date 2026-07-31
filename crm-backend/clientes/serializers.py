from rest_framework import serializers
from .models import Cliente, Factura    

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"

class ClienteSerializer(serializers.ModelSerializer):
    facturas = FacturaSerializer(many=True, read_only=True, source='factura_set')
    class Meta:
        model = Cliente
        fields = "__all__"

