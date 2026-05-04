import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../../components/login/login.component';
import { CuentaAtrasComponent } from '../../components/cuenta-atras/cuenta-atras.component';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoginComponent,
    CuentaAtrasComponent,
    RevealDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  enviando = false;
  nombre = '';
  apellido = '';
  tieneAcompanante = false;
  nombreAcompanante = '';
  apellidoAcompanante = '';
  alergenos = '';

  numeroCuenta = 'ES19 0128 7820 8401 0383 8162';
  numeroCuentaEric = 'ES08 1544 7889 7766 5222 6482';
  telefono1 = '+34 607 94 31 26';
  telefono2 = '+34 628 52 51 72';
  tel1Href = 'tel:+34607943126';
  tel2Href = 'tel:+34628525172';

  ubicacion = {
    nombre: 'Monasterio de Aciveiro',
    direccion: 'Forcarei, Pontevedra',
  };

  mostrarLogin = false;

  constructor(
    private googleSheets: GoogleSheetsService,
    public auth: AuthService,
    private router: Router
  ) {}

  get isLoggedIn() { return this.auth.isLoggedIn(); }

  enviarFormulario() {
    if (!this.nombre || !this.apellido) {
      alert('Por favor, completa tu nombre y apellido.');
      return;
    }
    const datos = {
      nombre: this.nombre,
      apellido: this.apellido,
      tieneAcompanante: this.tieneAcompanante,
      nombreAcompanante: this.nombreAcompanante,
      apellidoAcompanante: this.apellidoAcompanante,
      alergenos: this.alergenos
    };
    this.enviando = true;
    this.googleSheets.enviarDatos(datos).subscribe({
      next: () => {
        alert('¡Gracias por confirmar tu asistencia! Nos vemos el 20 de junio.');
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: () => {
        alert('Hubo un error al enviar. Por favor, inténtalo de nuevo.');
        this.enviando = false;
      }
    });
  }

  private limpiarFormulario() {
    this.nombre = '';
    this.apellido = '';
    this.tieneAcompanante = false;
    this.nombreAcompanante = '';
    this.apellidoAcompanante = '';
    this.alergenos = '';
  }

  abrirMaps() {
    window.open('https://www.google.com/maps/search/?api=1&query=Monasterio+de+Aciveiro+Forcarei', '_blank');
  }

  copiarCuenta() {
    navigator.clipboard.writeText(this.numeroCuenta);
    alert('Número de cuenta copiado al portapapeles');
  }

  copiarCuentaEric() {
    navigator.clipboard.writeText(this.numeroCuentaEric);
    alert('Número de cuenta copiado al portapapeles');
  }
}
