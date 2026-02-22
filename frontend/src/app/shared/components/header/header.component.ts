import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { AuthService } from '../../../core/services/auth.service';
import { SearchResult, Alert } from '../../../core/models';
import { MOCK_ALERTS } from '../../../core/mock-data';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery = '';
  searchResults = signal<SearchResult[]>([]);
  showSearch = signal(false);
  showNotif = signal(false);
  showUserMenu = signal(false);
  alerts: Alert[] = MOCK_ALERTS.slice(0, 5);
  unreadCount = signal(3);
  wsConnected = signal(true);

  constructor(
    private api: ApiService,
    private ws: WebSocketService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSearch(): void {
    if (this.searchQuery.length < 2) { this.showSearch.set(false); return; }
    this.api.search(this.searchQuery).subscribe(r => {
      this.searchResults.set(r);
      this.showSearch.set(r.length > 0);
    });
  }

  hideSearch(): void { setTimeout(() => this.showSearch.set(false), 200); }
  toggleNotif(): void { this.showNotif.update(v => !v); this.showUserMenu.set(false); }
  toggleUserMenu(): void { this.showUserMenu.update(v => !v); this.showNotif.set(false); }
  markAllRead(): void { this.unreadCount.set(0); }

  getUserName(): string { return this.auth.user()?.fullName || ''; }
  getUserInitials(): string {
    const name = this.auth.user()?.fullName || '';
    return name.split(' ').map(w => w[0]).slice(-2).join('');
  }
  getUserRole(): string {
    const labels: Record<string, string> = {
      ADMIN: 'Quản trị viên', DOCTOR: 'Bác sĩ', NURSE: 'Điều dưỡng',
      PHARMACIST: 'Dược sĩ', PATIENT: 'Bệnh nhân', DATA_ANALYST: 'Phân tích dữ liệu'
    };
    return this.auth.user()?.roles.map(r => labels[r] || r).join(', ') || '';
  }

  logout(): void {
    this.showUserMenu.set(false);
    this.auth.logout();
  }

  getLevelClass(level: string): string {
    const m: Record<string, string> = { CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' };
    return m[level] || 'badge-info';
  }
}
