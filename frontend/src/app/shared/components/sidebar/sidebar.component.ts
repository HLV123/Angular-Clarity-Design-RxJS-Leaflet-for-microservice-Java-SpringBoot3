import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NAV_ITEMS } from '../../../core/mock-data';
import { NavItem, UserRole } from '../../../core/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  collapsed = signal(false);
  user = this.auth.user;

  sections = computed(() => {
    const roles = this.auth.userRoles();
    const items = NAV_ITEMS.filter(n => {
      if (!n.roles || n.roles.length === 0) return true;
      return n.roles.some(r => roles.includes(r));
    });
    const grouped: Record<string, NavItem[]> = {};
    items.forEach(item => {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push(item);
    });
    return Object.entries(grouped).map(([section, items]) => ({ section, items }));
  });

  private roleLabels: Record<string, string> = {
    ADMIN: 'Quản trị', DOCTOR: 'Bác sĩ', NURSE: 'Điều dưỡng',
    PHARMACIST: 'Dược sĩ', PATIENT: 'Bệnh nhân', DATA_ANALYST: 'Phân tích'
  };

  constructor(public auth: AuthService) {}

  toggle(): void { this.collapsed.update(v => !v); }
  logout(): void { this.auth.logout(); }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(-2).join('');
  }

  getRoleLabel(role: string): string {
    return this.roleLabels[role] || role;
  }
}
