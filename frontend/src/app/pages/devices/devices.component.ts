import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { IoTDevice } from '../../core/models';
import { MOCK_PATIENTS } from '../../core/mock-data';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  devices = signal<IoTDevice[]>([]);
  searchTerm = signal('');
  filterStatus = signal('ALL');
  filterType = signal('ALL');

  // Stats
  onlineCount = computed(() => this.devices().filter(d => d.status === 'ONLINE').length);
  offlineCount = computed(() => this.devices().filter(d => d.status === 'OFFLINE').length);
  warningCount = computed(() => this.devices().filter(d => d.status === 'WARNING' || d.status === 'ERROR').length);
  lowBatteryCount = computed(() => this.devices().filter(d => d.batteryLevel < 20 && d.batteryLevel > 0).length);

  // Filtered
  filteredDevices = computed(() => {
    let data = this.devices();
    const q = this.searchTerm().toLowerCase();
    if (q) data = data.filter(d =>
      d.id.toLowerCase().includes(q) || d.model.toLowerCase().includes(q) ||
      (d.assignedPatientName || '').toLowerCase().includes(q) || d.ward.toLowerCase().includes(q)
    );
    if (this.filterStatus() !== 'ALL') data = data.filter(d => d.status === this.filterStatus());
    if (this.filterType() !== 'ALL') data = data.filter(d => d.type === this.filterType());
    return data;
  });

  // Device types for filter
  deviceTypes = computed(() => [...new Set(this.devices().map(d => d.type))]);

  // Modals
  showAssignModal = signal(false);
  showDetailModal = signal(false);
  selectedDevice = signal<IoTDevice | null>(null);
  assignPatientId = signal('');

  patients = MOCK_PATIENTS;

  constructor(private api: ApiService, public toast: ToastService) {}

  ngOnInit(): void {
    this.api.getDevices().subscribe(d => this.devices.set(d));
  }

  getStatusClass(status: string): string {
    return ({ ONLINE: 'badge-low', OFFLINE: 'badge-critical', WARNING: 'badge-medium', ERROR: 'badge-high' } as any)[status] || '';
  }

  getStatusIcon(status: string): string {
    return ({ ONLINE: 'fa-circle-check', OFFLINE: 'fa-circle-xmark', WARNING: 'fa-triangle-exclamation', ERROR: 'fa-circle-exclamation' } as any)[status] || 'fa-circle';
  }

  getBatteryIcon(level: number): string {
    if (level === 0) return 'fa-battery-empty';
    if (level < 25) return 'fa-battery-quarter';
    if (level < 50) return 'fa-battery-half';
    if (level < 75) return 'fa-battery-three-quarters';
    return 'fa-battery-full';
  }

  getBatteryColor(level: number): string {
    if (level === 0) return '#94a3b8';
    if (level < 20) return '#ef4444';
    if (level < 50) return '#f59e0b';
    return '#10b981';
  }

  getQualityColor(q: number): string {
    if (q >= 90) return '#10b981';
    if (q >= 70) return '#f59e0b';
    return '#ef4444';
  }

  openDetail(d: IoTDevice): void {
    this.selectedDevice.set(d);
    this.showDetailModal.set(true);
  }

  openAssign(d: IoTDevice): void {
    this.selectedDevice.set(d);
    this.assignPatientId.set(d.assignedPatientId || '');
    this.showAssignModal.set(true);
  }

  saveAssign(): void {
    const dev = this.selectedDevice();
    if (!dev) return;
    const patient = this.patients.find(p => p.id === this.assignPatientId());
    this.devices.update(all => all.map(d => d.id === dev.id ? {
      ...d,
      assignedPatientId: this.assignPatientId() || undefined,
      assignedPatientName: patient?.fullName || undefined
    } : d));
    this.showAssignModal.set(false);
    this.toast.success(this.assignPatientId()
      ? `Đã gán ${dev.id} cho ${patient?.fullName} (POST /api/v1/devices/${dev.id}/assign)`
      : `Đã bỏ gán ${dev.id} (DELETE /api/v1/devices/${dev.id}/assign)`
    );
  }

  requestCalibration(d: IoTDevice): void {
    this.toast.success(`Yêu cầu hiệu chỉnh ${d.id} đã gửi (POST /api/v1/devices/${d.id}/calibrate)`);
  }

  closeModals(): void {
    this.showAssignModal.set(false);
    this.showDetailModal.set(false);
    this.selectedDevice.set(null);
  }
}
