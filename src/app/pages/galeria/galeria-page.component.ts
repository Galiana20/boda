import { Component } from '@angular/core';
import { GaleriaComponent } from '../../components/galeria/galeria.component';

@Component({
  selector: 'app-galeria-page',
  standalone: true,
  imports: [GaleriaComponent],
  template: `
    <div class="galeria-page">
      <div class="galeria-page-header">
        <h1 class="galeria-page-title">Galería</h1>
        <p class="galeria-page-sub">Momentos especiales de nuestra boda</p>
      </div>
      <div class="galeria-page-content">
        <app-galeria></app-galeria>
      </div>
    </div>
  `,
  styles: [`
    .galeria-page {
      min-height: 100vh;
      background: #fdfcf9;
      padding-top: 64px;
    }

    .galeria-page-header {
      text-align: center;
      padding: 4rem 2rem 2rem;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
      color: white;
    }

    .galeria-page-title {
      font-family: 'Georgia', serif;
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 300;
      letter-spacing: 4px;
      margin: 0 0 0.8rem;
    }

    .galeria-page-sub {
      font-family: 'Georgia', serif;
      font-size: 1rem;
      color: rgba(255,255,255,0.7);
      letter-spacing: 2px;
      margin: 0;
    }

    .galeria-page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem 4rem;
    }
  `]
})
export class GaleriaPageComponent {}
