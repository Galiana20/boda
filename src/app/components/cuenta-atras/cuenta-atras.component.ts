import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tiempo {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

@Component({
  selector: 'app-cuenta-atras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuenta-atras.component.html',
  styleUrl: './cuenta-atras.component.css'
})
export class CuentaAtrasComponent implements OnInit, OnDestroy {
  // Fecha de la boda: 20 de junio de 2026
  private readonly BODA = new Date('2026-06-20T17:00:00');

  tiempo: Tiempo = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  yaPaso = false;
  private timer!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.calcular();
    this.timer = setInterval(() => this.calcular(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private calcular() {
    const diff = this.BODA.getTime() - Date.now();
    if (diff <= 0) {
      this.yaPaso = true;
      this.tiempo = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
      clearInterval(this.timer);
      return;
    }
    this.tiempo = {
      dias:     Math.floor(diff / (1000 * 60 * 60 * 24)),
      horas:    Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutos:  Math.floor((diff / (1000 * 60)) % 60),
      segundos: Math.floor((diff / 1000) % 60)
    };
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
