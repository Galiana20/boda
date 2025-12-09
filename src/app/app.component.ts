import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TimelineModule } from 'primeng/timeline';
import { DividerModule } from 'primeng/divider';

interface TimelineEvent {
  time: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    TimelineModule,
    DividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Boda Eric y Lourdes';

  // Datos del formulario
  nombre: string = '';
  apellido: string = '';
  tieneAcompanante: boolean = false;
  nombreAcompanante: string = '';
  apellidoAcompanante: string = '';
  alergenos: string = '';

  // Datos de la boda
  numeroCuenta: string = 'ES19 0128 7820 8401 0383 8162';
  telefono1: string = '+34 XXX XXX XXX';
  telefono2: string = '+34 XXX XXX XXX';

  // Timeline de eventos
  events: TimelineEvent[] = [
    { time: '17:00', title: 'Llegada de Invitados', icon: 'pi pi-users' },
    { time: '17:30', title: 'Ceremonia', icon: 'pi pi-heart' },
    { time: '19:00', title: 'Cena', icon: 'pi pi-star' },
    { time: '22:00', title: 'Fiesta', icon: 'pi pi-sun' }
  ];

  // Ubicación
  ubicacion = {
    nombre: 'Monasterio de Aciveiro',
    direccion: 'Forcarei, Pontevedra',
    lat: 42.6178,
    lng: -8.3892
  };

  enviarFormulario() {
    const datos = {
      nombre: this.nombre,
      apellido: this.apellido,
      tieneAcompanante: this.tieneAcompanante,
      nombreAcompanante: this.nombreAcompanante,
      apellidoAcompanante: this.apellidoAcompanante,
      alergenos: this.alergenos
    };

    console.log('Formulario enviado:', datos);
    alert('¡Gracias por confirmar tu asistencia! Nos vemos el 20 de junio.');

    // Limpiar formulario
    this.nombre = '';
    this.apellido = '';
    this.tieneAcompanante = false;
    this.nombreAcompanante = '';
    this.apellidoAcompanante = '';
    this.alergenos = '';
  }

  abrirMaps() {
    window.open(`https://www.google.com/maps/search/?api=1&query=Monasterio+de+Aciveiro+Forcarei`, '_blank');
  }

  copiarCuenta() {
    navigator.clipboard.writeText(this.numeroCuenta);
    alert('Número de cuenta copiado al portapapeles');
  }
}
