import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Foto } from '../../services/firebase.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit {
  fotos: Foto[] = [];
  cargando = true;
  fotoAmpliada: Foto | null = null;
  indiceActual = 0;

  constructor(private firebase: FirebaseService) {}

  async ngOnInit() {
    try {
      this.fotos = await this.firebase.getFotosAprobadas();
    } catch (e) {
      console.error('Error cargando galería:', e);
    } finally {
      this.cargando = false;
    }
  }

  abrirFoto(foto: Foto) {
    this.indiceActual = this.fotos.indexOf(foto);
    this.fotoAmpliada = foto;
  }

  cerrarFoto() {
    this.fotoAmpliada = null;
  }

  anterior() {
    this.indiceActual = (this.indiceActual - 1 + this.fotos.length) % this.fotos.length;
    this.fotoAmpliada = this.fotos[this.indiceActual];
  }

  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.fotos.length;
    this.fotoAmpliada = this.fotos[this.indiceActual];
  }
}
