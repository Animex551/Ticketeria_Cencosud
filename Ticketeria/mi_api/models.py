from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuariosManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_IT', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class Usuarios(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=255, primary_key=True)
    username = models.CharField(max_length=255)
    is_IT = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = UsuariosManager()

    def __str__(self):
        return self.username

class Zonas(models.Model):
    sucursal = models.CharField(max_length=255)
    sector = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.sucursal} - {self.sector}"

class TipoFalla(models.Model):
    tipo = models.CharField(max_length=255)
    prioridad = models.IntegerField()

    def __str__(self):
        return self.tipo

class Tickets(models.Model):
    nombre = models.CharField(max_length=255)
    estado = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
    id_cliente = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='tickets_cliente')
    id_tecnico = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_asignados')
    id_zona_problema = models.ForeignKey(Zonas, on_delete=models.CASCADE)
    id_falla = models.ForeignKey(TipoFalla, on_delete=models.CASCADE)

    def __str__(self):
        return f"Ticket #{self.id}: {self.nombre}"

# Modelo único y correcto para los adjuntos
class Adjunto(models.Model):
    path = models.ImageField(upload_to='adjuntos/', blank=True, null=True)
    id_tickets = models.ForeignKey(Tickets, on_delete=models.CASCADE, related_name='adjuntos')

    def __str__(self):
        return f"Adjunto {self.id} del Ticket {self.id_tickets.id}"

class BitacoraTicket(models.Model):
    id_ticket = models.ForeignKey(Tickets, on_delete=models.CASCADE, related_name='bitacoras')
    tecnico_id = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='bitacoras_escritas')
    commit = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bitácora {self.id} - Ticket {self.id_ticket.id}"

class BitacoraAdjuntos(models.Model):
    # Aquí deberías considerar cambiar esto a ImageField si quieres el mismo comportamiento
    path = models.CharField(max_length=255) 
    id_bitacora = models.ForeignKey(BitacoraTicket, on_delete=models.CASCADE, related_name='adjuntos_bitacora')

    def __str__(self):
        return f"Adjunto {self.id} de Bitácora {self.id_bitacora.id}"