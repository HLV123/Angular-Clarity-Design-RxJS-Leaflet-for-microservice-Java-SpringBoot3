import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse, UserRole } from '../models';
import { MOCK_USERS } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  userRoles = computed(() => this.currentUser()?.roles ?? []);

  constructor(private router: Router) {
    const saved = localStorage.getItem('shms_user');
    if (saved) {
      try { this.currentUser.set(JSON.parse(saved)); }
      catch { localStorage.removeItem('shms_user'); }
    }
  }

  login(req: LoginRequest): boolean {
    const entry = MOCK_USERS[req.username];
    if (entry && entry.password === req.password) {
      this.currentUser.set(entry.user);
      this.token.set('mock-jwt-' + Date.now());
      localStorage.setItem('shms_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('shms_user');
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.userRoles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some(r => this.userRoles().includes(r));
  }

  getToken(): string | null {
    return this.token();
  }
}
