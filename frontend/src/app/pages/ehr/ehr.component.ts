import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, ClinicalNote, Diagnosis, LabResult } from '../../core/models';
import { MOCK_MEDICAL_IMAGES } from '../../core/mock-data/analytics.data';

@Component({
  selector: 'app-ehr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ehr.component.html',
  styleUrls: ['./ehr.component.scss']
})
export class EhrComponent implements OnInit {
  patients = signal<Patient[]>([]);
  selectedPatientId = signal('P-0042');
  activeTab = signal<'notes' | 'diagnoses' | 'labs' | 'imaging' | 'timeline'>('notes');

  notes = signal<ClinicalNote[]>([]);
  diagnoses = signal<Diagnosis[]>([]);
  labResults = signal<LabResult[]>([]);
  images = MOCK_MEDICAL_IMAGES;

  showNoteForm = signal(false);
  newNote = { subjective: '', objective: '', assessment: '', plan: '' };

  selectedPatient = computed(() => this.patients().find(p => p.id === this.selectedPatientId()));
  inpatients = computed(() => this.patients().filter(p => p.status !== 'Ra viện'));

  // Dynamically constructed timeline based on patient data
  timeline = computed(() => {
    const events: any[] = [];

    this.notes().forEach(n => events.push({
      date: n.createdAt,
      title: `${n.type} Note`,
      desc: `Đánh giá: ${n.assessment}`,
      doctor: n.doctorName,
      icon: 'fa-note-sticky',
      color: '#3b82f6'
    }));

    this.diagnoses().forEach(d => events.push({
      date: d.diagnosedAt.includes('T') ? d.diagnosedAt : d.diagnosedAt + 'T00:00:00Z',
      title: `Chẩn đoán: ${d.icd10Code}`,
      desc: d.description,
      doctor: d.doctorName,
      icon: 'fa-stethoscope',
      color: '#f59e0b'
    }));

    this.labResults().forEach(l => events.push({
      date: l.resultDate.includes('T') ? l.resultDate : l.resultDate + 'T00:00:00Z',
      title: `Xét nghiệm: ${l.category}`,
      desc: `${l.testName}: ${l.value} ${l.unit} (${l.status})`,
      doctor: l.orderedBy,
      icon: 'fa-flask',
      color: l.status === 'Critical' ? '#ef4444' : (l.status === 'Abnormal' ? '#f59e0b' : '#10b981')
    }));

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getPatients().subscribe(p => this.patients.set(p));
    this.loadPatientData();
  }

  selectPatient(id: string): void {
    this.selectedPatientId.set(id);
    this.loadPatientData();
  }

  setTab(tab: 'notes' | 'diagnoses' | 'labs' | 'imaging' | 'timeline'): void { this.activeTab.set(tab); }

  private loadPatientData(): void {
    const id = this.selectedPatientId();
    this.api.getClinicalNotes(id).subscribe(n => this.notes.set(n));
    this.api.getDiagnoses(id).subscribe(d => this.diagnoses.set(d));
    this.api.getLabResults(id).subscribe(l => this.labResults.set(l));
  }

  openNoteForm(): void { this.showNoteForm.set(true); }
  closeNoteForm(): void { this.showNoteForm.set(false); this.newNote = { subjective: '', objective: '', assessment: '', plan: '' }; }

  saveNote(): void {
    this.toast.success('SOAP Note đã được lưu (POST /api/v1/ehr/' + this.selectedPatientId() + '/notes)');
    this.closeNoteForm();
  }

  getLabStatusClass(status: string): string {
    return ({ Normal: 'badge-low', Abnormal: 'badge-medium', Critical: 'badge-critical' } as any)[status] || '';
  }

  getDiagnosisTypeLabel(type: string): string {
    return ({ primary: 'Chính', secondary: 'Phụ', suspected: 'Nghi ngờ' } as any)[type] || type;
  }
}
