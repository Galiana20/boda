import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { SubirFotoComponent } from '../subir-foto/subir-foto.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoginComponent, SubirFotoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  scrolled = false;
  menuAbierto = false;
  mostrarLogin = false;
  mostrarSubir = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll() {
    this.scrolled = window.scrollY > 60;
  }

  get isLoggedIn() { return this.auth.isLoggedIn(); }
  get canUpload()  { return this.auth.canUpload(); }
  get isAdmin()    { return this.auth.isAdmin(); }

  get isHero() {
    return this.router.url === '/' || this.router.url === '';
  }

  irAdmin() {
    this.menuAbierto = false;
    this.router.navigate(['/admin']);
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }
}
