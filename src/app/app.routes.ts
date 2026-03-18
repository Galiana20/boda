import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria/galeria-page.component').then(m => m.GaleriaPageComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-fotos/admin-fotos.component').then(m => m.AdminFotosComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
