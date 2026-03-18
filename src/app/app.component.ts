import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    @if (!isAdminRoute) {
      <app-navbar></app-navbar>
    }
    <router-outlet />
  `,
  styles: []
})
export class AppComponent {
  constructor(private router: Router) {}

  get isAdminRoute() {
    return this.router.url.startsWith('/admin');
  }
}
