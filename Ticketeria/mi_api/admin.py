from django.contrib import admin
from .models import Usuarios, Zonas, TipoFalla, Tickets, Adjunto, BitacoraTicket, BitacoraAdjuntos

@admin.register(Usuarios)
class UsuariosAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_IT', 'is_admin')
    search_fields = ('email', 'username')

@admin.register(Tickets)
class TicketsAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'estado', 'id_cliente', 'id_tecnico', 'fecha_creacion')
    list_filter = ('estado', 'id_zona_problema', 'id_falla')
    search_fields = ('nombre', 'descripcion')

# Registro básico para los demás modelos
admin.site.register(Zonas)
admin.site.register(TipoFalla)
admin.site.register(Adjunto)
admin.site.register(BitacoraTicket)
admin.site.register(BitacoraAdjuntos)