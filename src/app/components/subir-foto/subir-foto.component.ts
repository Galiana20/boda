import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-subir-foto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subir-foto.component.html',
  styleUrl: './subir-foto.component.css'
})
export class SubirFotoComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() fotoSubida = new EventEmitter<void>();

  archivosSeleccionados: File[] = [];
  previews: string[] = [];
  progreso: number[] = [];
  subiendo = false;
  errores: string[] = [];
  completados = 0;

  constructor(private auth: AuthService, private firebase: FirebaseService) {}

  get isAdmin() { return this.auth.isAdmin(); }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.archivosSeleccionados = Array.from(input.files);
    this.previews = [];
    this.archivosSeleccionados.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => this.previews.push(e.target!.result as string);
      reader.readAsDataURL(file);
    });
    this.errores = [];
    this.completados = 0;
    this.progreso = new Array(this.archivosSeleccionados.length).fill(0);
  }

  async subir() {
    if (!this.archivosSeleccionados.length) return;
    this.subiendo = true;
    this.errores = [];
    this.completados = 0;
    const autoAprobar = this.isAdmin;

    const uploads = this.archivosSeleccionados.map((file, i) =>
      new Promise<void>(resolve => {
        this.firebase.subirFoto(file, autoAprobar).subscribe({
          next: ({ progress }) => { this.progreso[i] = progress; },
          error: err => {
            this.errores.push(`Error en ${file.name}: ${err.message}`);
            resolve();
          },
          complete: () => { this.completados++; resolve(); }
        });
      })
    );

    await Promise.all(uploads);
    this.subiendo = false;

    if (!this.errores.length) {
      this.fotoSubida.emit();
      setTimeout(() => this.cerrar.emit(), 1500);
    }
  }

  quitarArchivo(i: number) {
    this.archivosSeleccionados.splice(i, 1);
    this.previews.splice(i, 1);
    this.progreso.splice(i, 1);
  }
}
