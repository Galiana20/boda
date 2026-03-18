import { Injectable, signal, computed } from '@angular/core';
import { FirebaseService } from './firebase.service';

export type UserRole = 'admin' | 'fotosboda' | null;

// Mapa: contraseña → { email de Firebase, rol }
const CREDENTIALS: Record<string, { email: string; role: UserRole }> = {
  'ADMINGALIANA': { email: 'admingaliana@boda.com', role: 'admin' },
  'FOTOSBODA':    { email: 'fotosboda@boda.com',    role: 'fotosboda' }
};

const STORAGE_KEY = 'boda_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _role = signal<UserRole>(this.loadRole());
  private _loading = signal(false);

  readonly role     = this._role.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly isAdmin  = computed(() => this._role() === 'admin');
  readonly canUpload = computed(() => this._role() === 'admin' || this._role() === 'fotosboda');
  readonly isLoggedIn = computed(() => this._role() !== null);

  constructor(private firebase: FirebaseService) {}

  /** Devuelve true si la contraseña es correcta y Firebase Auth acepta el login */
  async login(password: string): Promise<boolean> {
    const key = password.trim().toUpperCase();
    const creds = CREDENTIALS[key];
    if (!creds) return false;

    this._loading.set(true);
    try {
      await this.firebase.signIn(creds.email, password.trim());
      this._role.set(creds.role);
      sessionStorage.setItem(STORAGE_KEY, creds.role!);
      return true;
    } catch {
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.firebase.signOut();
    this._role.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private loadRole(): UserRole {
    return (sessionStorage.getItem(STORAGE_KEY) as UserRole) ?? null;
  }
}
