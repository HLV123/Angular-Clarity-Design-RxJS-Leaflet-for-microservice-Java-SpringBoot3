import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Appointment } from '../../core/models';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointments = signal<Appointment[]>([]);

  todayCount = computed(() => this.appointments().length);
  waitingCount = computed(() => this.appointments().filter(a => a.status === 'Chờ khám' || a.status === 'Đã check-in').length);
  completedCount = computed(() => this.appointments().filter(a => a.status === 'Đã hoàn thành').length);

  filterDoctor = signal('ALL');
  filterStatus = signal('ALL');

  filteredAppointments = computed(() => {
    return this.appointments().filter(a => {
      if (this.filterDoctor() !== 'ALL' && !a.doctorName.includes(this.filterDoctor())) return false;
      if (this.filterStatus() !== 'ALL' && a.status !== this.filterStatus()) return false;
      return true;
    }).sort((a, b) => {
      // Sort priority
      const order = { 'Đang khám': 1, 'Chờ khám': 2, 'Đã check-in': 3, 'Đã đặt': 4, 'Đã hoàn thành': 5, 'Đã hủy': 6 };
      return (order[a.status as keyof typeof order] || 99) - (order[b.status as keyof typeof order] || 99);
    });
  });

  doctors = computed(() => {
    const docs = new Set<string>();
    this.appointments().forEach(a => docs.add(a.doctorName));
    return Array.from(docs);
  });

  private sub!: Subscription;

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getAppointments().subscribe(data => {
      this.appointments.set(data);
      this.setupRealtimeSync();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  setupRealtimeSync(): void {
    // Simulate WebSocket STOMP queue updates
    this.sub = interval(10000).subscribe(() => {
      const current = [...this.appointments()];
      const waiting = current.filter(a => a.status === 'Chờ khám' || a.status === 'Đã check-in');

      if (waiting.length > 0) {
        // Automatically pick one doctor queue to progress
        const toStart = waiting[Math.floor(Math.random() * waiting.length)];
        const doc = toStart.doctorName;

        const ongoing = current.find(a => a.status === 'Đang khám' && a.doctorName === doc);
        if (ongoing) {
          ongoing.status = 'Đã hoàn thành';
          ongoing.completedAt = new Date().toISOString();
          this.toast.success(`[STOMP Update] BS ${doc} đã khám xong cho BN ${ongoing.patientName}`);
        }

        toStart.status = 'Đang khám';
        toStart.startedAt = new Date().toISOString();
        this.toast.success(`[STOMP Update] Gọi BN ${toStart.patientName} vào khám với BS ${doc}`);

        this.appointments.set(current);
      }
    });
  }

  callPatient(app: Appointment): void {
    const current = [...this.appointments()];
    const ongoing = current.find(a => a.status === 'Đang khám' && a.doctorName === app.doctorName);
    if (ongoing) {
      ongoing.status = 'Đã hoàn thành';
    }

    const target = current.find(a => a.id === app.id);
    if (target) {
      target.status = 'Đang khám';
      this.appointments.set(current);
      this.toast.success(`Đã gọi BN ${target.patientName} vào phòng khám`);
    }
  }

  completeAppointment(app: Appointment): void {
    const current = [...this.appointments()];
    const target = current.find(a => a.id === app.id);
    if (target) {
      target.status = 'Đã hoàn thành';
      this.appointments.set(current);
      this.toast.success(`Đã hoàn thành lượt khám của BN ${target.patientName}`);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Đang khám': return 'badge-info';
      case 'Chờ khám': return 'badge-medium';
      case 'Đã check-in': return 'badge-warning'; // Let's map check-in to warning or medium
      case 'Đã đặt': return 'badge-normal';
      case 'Đã hoàn thành': return 'badge-low';
      case 'Đã hủy': return 'badge-critical';
      default: return 'badge-normal';
    }
  }
}
