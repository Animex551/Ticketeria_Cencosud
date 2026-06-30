from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Usuarios, Zonas, TipoFalla, Tickets, Adjunto, BitacoraTicket, BitacoraAdjuntos
from .serializers import *

class UsuariosViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

class ZonasViewSet(viewsets.ModelViewSet):
    queryset = Zonas.objects.all()
    serializer_class = ZonasSerializer

class TipoFallaViewSet(viewsets.ModelViewSet):
    queryset = TipoFalla.objects.all()
    serializer_class = TipoFallaSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Tickets.objects.all().order_by('-fecha_creacion')
    serializer_class = TicketSerializer
    

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Tickets.objects.all().order_by('-fecha_creacion')
    serializer_class = TicketSerializer
    
    def get_queryset(self):
        # 1. Mantenemos lo que ya funciona para edición
        if self.action in ['retrieve', 'partial_update', 'update']:
            return Tickets.objects.all()
            
        # 2. AGREGA ESTA LÍNEA AQUÍ (Es la única que le permite al Admin ver todo)
        if self.request.query_params.get('all') == 'true':
            return Tickets.objects.all().order_by('-fecha_creacion')
        
        # 3. Tu lógica de filtros sigue abajo intacta:
        email_cliente = self.request.query_params.get('cliente')
        vista = self.request.query_params.get('vista')
        tecnico = self.request.query_params.get('tecnico') # Nuevo parámetro

        if vista == 'tomados' and tecnico:
            return Tickets.objects.filter(id_tecnico__email=tecnico, estado='En Proceso') \
                                  .order_by('-fecha_creacion')

        if vista == 'abiertos':
            return Tickets.objects.filter(estado='Abierto') \
                                  .exclude(id_cliente__email__iexact=email_cliente) \
                                  .order_by('-fecha_creacion')

        if email_cliente:
            return Tickets.objects.filter(id_cliente__email__iexact=email_cliente) \
                                  .order_by('-fecha_creacion')

        return Tickets.objects.none()

    def create(self, request, *args, **kwargs):
        datos_limpios = request.data.copy()
        id_falla = datos_limpios.get('id_falla')
        
        try:
            falla_obj = TipoFalla.objects.get(id=id_falla)
            datos_limpios['prioridad'] = falla_obj.prioridad 
        except TipoFalla.DoesNotExist:
            datos_limpios['prioridad'] = 1 

        archivos = request.FILES.getlist('path')
        if 'path' in datos_limpios: del datos_limpios['path']

        serializer = self.get_serializer(data=datos_limpios)
        serializer.is_valid(raise_exception=True)
        ticket_guardado = serializer.save()

        for archivo in archivos:
            Adjunto.objects.create(path=archivo, id_tickets_id=ticket_guardado.id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AdjuntoViewSet(viewsets.ModelViewSet):
    queryset = Adjunto.objects.all()
    serializer_class = AdjuntoSerializer

    def get_queryset(self):
        queryset = Adjunto.objects.all()
        
        ticket_id = self.request.query_params.get('ticket')
        if ticket_id:
            # Aquí es donde ocurre la magia: filtramos desde la BD
            queryset = queryset.filter(id_tickets_id=ticket_id) 
        return queryset

class BitacoraTicketViewSet(viewsets.ModelViewSet):
    queryset = BitacoraTicket.objects.all().order_by('-fecha_registro')
    serializer_class = BitacoraTicketSerializer

class BitacoraAdjuntosViewSet(viewsets.ModelViewSet):
    queryset = BitacoraAdjuntos.objects.all()
    serializer_class = BitacoraAdjuntosSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None and user.is_active:
            return Response({
                'id': user.pk, # 👈 CLAVE: Este ID lo usarás en el Frontend
                'email': user.email,
                'username': user.username,
                'is_IT': user.is_IT,
                "is_admin": user.is_admin
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales incorrectas.'}, status=status.HTTP_401_UNAUTHORIZED)