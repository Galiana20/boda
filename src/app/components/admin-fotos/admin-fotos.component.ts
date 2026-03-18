import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService, Foto } from '../../services/firebase.service';
import { SubirFotoComponent } from '../subir-foto/subir-foto.component';

@Component({
  selector: 'app-admin-fotos',
  standalone: true,
  imports: [CommonModule, SubirFotoComponent],
  templateUrl: './admin-fotos.component.html',
  styleUrl: './admin-fotos.component.css'
})
export class AdminFotosComponent implements OnInit {
  fotos: Foto[] = [];
  cargando = true;
  mostrarSubir = false;
  procesando: Set<string> = new Set();

  constructor(
    private auth: AuthService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    await this.cargarFotos();
  }

  async cargarFotos() {
    this.cargando = true;
    try {
      this.fotos = await this.firebase.getTodasFotos();
    } catch (e) {
      console.error('Error cargando fotos:', e);
    } finally {
      this.cargando = false;
    }
  }

  get fotosAprobadas() { return this.fotos.filter(f => f.aprobada === 'true'); }
  get fotosPendientes() { return this.fotos.filter(f => f.aprobada !== 'true'); }

  async toggleAprobada(foto: Foto) {
    this.procesando.add(foto.id!);
    try {
      await this.firebase.toggleAprobada(foto);
      foto.aprobada = foto.aprobada === 'true' ? 'false' : 'true';
    } catch (e) {
      console.error('Error actualizando foto:', e);
    } finally {
      this.procesando.delete(foto.id!);
    }
  }

  async eliminar(foto: Foto) {
    if (!confirm('¿Seguro que quieres eliminar esta foto? No se puede deshacer.')) return;
    this.procesando.add(foto.id!);
    try {
      await this.firebase.eliminarFoto(foto);
      this.fotos = this.fotos.filter(f => f.id !== foto.id);
    } catch (e) {
      console.error('Error eliminando foto:', e);
    } finally {
      this.procesando.delete(foto.id!);
    }
  }

  isProcesando(foto: Foto) { return this.procesando.has(foto.id!); }

  volver() { this.router.navigate(['/']); }
}
