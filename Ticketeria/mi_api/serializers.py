from rest_framework import serializers
from .models import Usuarios, Zonas, TipoFalla, Tickets, Adjunto, BitacoraTicket, BitacoraAdjuntos

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['email', 'username', 'password', 'is_IT', 'is_admin']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return Usuarios.objects.create_user(**validated_data)

class ZonasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zonas
        fields = '__all__'

class TipoFallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoFalla
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    # Esto busca al usuario por email automáticamente al recibir el PATCH
    id_tecnico = serializers.SlugRelatedField(
        slug_field='email', 
        queryset=Usuarios.objects.all(), 
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Tickets
        fields = '__all__'
        

# serializers.py
class AdjuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adjunto
        fields = '__all__' # Con esto deberías ver todos los campos 

class BitacoraTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraTicket
        fields = '__all__'

class BitacoraAdjuntosSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraAdjuntos
        fields = '__all__'