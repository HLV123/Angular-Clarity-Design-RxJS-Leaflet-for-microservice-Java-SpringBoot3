import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);

  // Search & Filter
  searchTerm = signal('');
  filterRole = signal('ALL');
  filterStatus = signal('ALL');

  // Modals
  showModal = signal(false);
  isEditing = signal(false);

  // Form Model
  currentUser: Partial<User> = {};

  filteredUsers = computed(() => {
    let result = this.users();
    const term = this.searchTerm().toLowerCase();

    if (term) {
      result = result.filter(u =>
        (u.fullName && u.fullName.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.username && u.username.toLowerCase().includes(term))
      );
    }

    if (this.filterRole() !== 'ALL') {
      result = result.filter(u => u.roles && u.roles.includes(this.filterRole() as any));
    }

    if (this.filterStatus() !== 'ALL') {
      result = result.filter(u => u.status === this.filterStatus());
    }

    return result;
  });

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getUsers().subscribe(u => this.users.set(u));
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentUser = { status: 'ACTIVE', roles: ['DOCTOR'] };
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.isEditing.set(true);
    // Deep copy for editing
    this.currentUser = JSON.parse(JSON.stringify(user));
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  updateRoles(val: string): void {
    this.currentUser.roles = val.split(',').map(s => s.trim() as any).filter(s => s.length > 0);
  }

  saveUser(): void {
    const currentList = [...this.users()];

    if (this.isEditing()) {
      const idx = currentList.findIndex(u => u.id === this.currentUser.id);
      if (idx !== -1) {
        currentList[idx] = this.currentUser as User;
        this.toast.success(`Đã cập nhật tài khoản ${this.currentUser.username}`);
      }
    } else {
      const newId = 'USR-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const newUser = {
        ...this.currentUser,
        id: newId,
        lastLogin: new Date().toISOString(),
        mfaEnabled: false
      } as User;
      currentList.push(newUser);
      this.toast.success(`Đã tạo tài khoản mới ${newUser.username}`);
    }

    this.users.set(currentList);
    this.closeModal();
  }

  deleteUser(id: string): void {
    if (confirm(`Bạn có chắc muốn xóa User ${id}?`)) {
      this.users.set(this.users().filter(u => u.id !== id));
      this.toast.success(`Đã xóa User ${id}`);
    }
  }

  toggleLock(user: User): void {
    const currentList = [...this.users()];
    const idx = currentList.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      const newState = currentList[idx].status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
      currentList[idx].status = newState;
      this.users.set(currentList);
      this.toast.success(`Tài khoản ${user.username} đã được ${newState === 'LOCKED' ? 'Khóa' : 'Mở khóa'}`);
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-critical';
      case 'DOCTOR': return 'badge-info';
      case 'NURSE': return 'badge-low';
      case 'PHARMACIST': return 'badge-medium';
      case 'PATIENT': return 'badge-normal';
      default: return 'badge-normal';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-low';
      case 'INACTIVE': return 'badge-normal';
      case 'LOCKED': return 'badge-critical';
      default: return 'badge-normal';
    }
  }
}
