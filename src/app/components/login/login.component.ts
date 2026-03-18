import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() cerrar = new EventEmitter<void>();

  password = '';
  error = false;
  mostrarPassword = false;
  cargando = false;

  constructor(private auth: AuthService) {}

  get isLoggedIn() { return this.auth.isLoggedIn(); }
  get role()       { return this.auth.role(); }

  async entrar() {
    if (!this.password) return;
    this.cargando = true;
    this.error = false;
    const ok = await this.auth.login(this.password);
    this.cargando = false;
    if (ok) {
      this.cerrar.emit();
    } else {
      this.error = true;
      this.password = '';
    }
  }

  async salir() {
    await this.auth.logout();
    this.cerrar.emit();
  }
}
