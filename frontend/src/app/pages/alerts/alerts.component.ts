import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Alert } from '../../core/models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  activeTab = signal<'list' | 'rules'>('list');
  alerts = signal<Alert[]>([]);

  // Filtering
  filterLevel = signal<string>('ALL');
  filterStatus = signal<string>('ALL');

  filteredAlerts = computed(() => {
    return this.alerts().filter(a => {
      if (this.filterLevel() !== 'ALL' && a.level !== this.filterLevel()) return false;
      if (this.filterStatus() !== 'ALL' && a.status !== this.filterStatus()) return false;
      return true;
    });
  });

  // Simple mock rules
  rules = signal([
    { id: 'R-01', metric: 'SpO2', operator: '<', value: 90, level: 'CRITICAL', isActive: true },
    { id: 'R-02', metric: 'Heart Rate', operator: '>', value: 120, level: 'HIGH', isActive: true },
    { id: 'R-03', metric: 'Glucose', operator: '>', value: 11.1, level: 'MEDIUM', isActive: true },
    { id: 'R-04', metric: 'Blood Pressure', operator: '>', value: 160, level: 'HIGH', isActive: false },
  ]);

  newRule = { metric: 'SpO2', operator: '<', value: 95, level: 'MEDIUM' };

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getAlerts().subscribe(data => this.alerts.set(data));
  }

  setTab(tab: 'list' | 'rules'): void {
    this.activeTab.set(tab);
  }

  acknowledgeAlert(id: string): void {
    const current = [...this.alerts()];
    const idx = current.findIndex(a => a.id === id);
    if (idx !== -1) {
      current[idx].status = 'ACKNOWLEDGED';
      current[idx].acknowledgedBy = 'Tôi (Admin)'; // Demo local mock
      current[idx].acknowledgedAt = new Date().toISOString();
      this.alerts.set(current);
      this.toast.success(`Đã xác nhận (ACK) cảnh báo ${id}`);
    }
  }

  resolveAlert(id: string): void {
    const current = [...this.alerts()];
    const idx = current.findIndex(a => a.id === id);
    if (idx !== -1) {
      current[idx].status = 'RESOLVED';
      this.alerts.set(current);
      this.toast.success(`Đã xử lý xong cảnh báo ${id}`);
    }
  }

  toggleRule(id: string): void {
    const current = [...this.rules()];
    const rule = current.find(r => r.id === id);
    if (rule) {
      rule.isActive = !rule.isActive;
      this.rules.set(current);
      this.toast.success(`Quy tắc đã được ${rule.isActive ? 'BẬT' : 'TẮT'}`);
    }
  }

  addRule(): void {
    const id = 'R-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.rules.set([...this.rules(), { ...this.newRule, id, isActive: true }]);
    this.toast.success('Đã thêm quy tắc cảnh báo mới');
  }

  getLevelClass(level: string): string {
    return 'badge-' + level.toLowerCase();
  }

  getStatusBadge(status: string): { class: string, label: string } {
    switch (status) {
      case 'UNACKNOWLEDGED': return { class: 'badge-critical', label: 'Chưa xử lý' };
      case 'ACKNOWLEDGED': return { class: 'badge-medium', label: 'Đã xác nhận' };
      case 'RESOLVED': return { class: 'badge-low', label: 'Đã giải quyết' };
      case 'SENT': return { class: 'badge-info', label: 'Đã gửi' };
      default: return { class: 'badge-normal', label: status };
    }
  }
}
