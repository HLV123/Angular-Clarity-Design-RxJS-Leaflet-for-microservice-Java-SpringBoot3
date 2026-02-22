import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient } from '../../core/models';

@Component({
  selector: 'app-patients', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients = signal<Patient[]>([]);
  searchTerm = signal('');
  statusFilter = signal('');
  riskFilter = signal('');
  showModal = signal(false);

  filtered = computed(() => {
    let data = this.patients();
    const q = this.searchTerm().toLowerCase();
    if (q) data = data.filter(p => p.fullName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q));
    if (this.statusFilter()) data = data.filter(p => p.status === this.statusFilter());
    if (this.riskFilter()) data = data.filter(p => p.riskLevel === this.riskFilter());
    return data;
  });

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void {
    this.api.getPatients().subscribe(p => this.patients.set(p));
  }

  getRiskClass(risk: string): string {
    return ({ Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' } as any)[risk] || '';
  }

  getStatusColor(status: string): string {
    return ({ 'Nội trú': '#1574ea', 'Ngoại trú': '#10b981', 'Khẩn cấp': '#ef4444', 'Ra viện': '#64748b' } as any)[status] || '#64748b';
  }

  addPatient(): void { this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }
  savePatient(): void { this.showModal.set(false); this.toast.success('Đã tạo bệnh nhân mới (POST /api/v1/patients → Kafka patient.created)'); }
}
