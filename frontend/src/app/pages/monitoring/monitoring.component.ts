import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient } from '../../core/models';
import { Subscription, interval } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hrCanvas') hrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spo2Canvas') spo2Canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bpCanvas') bpCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tempCanvas') tempCanvas!: ElementRef<HTMLCanvasElement>;

  patients = signal<Patient[]>([]);
  selectedPatientId = signal('P-0042');
  viewMode = signal<'single' | 'ward'>('single');

  currentVitals = signal({
    heartRate: 92, spO2: 97, systolicBP: 120, diastolicBP: 80,
    temperature: 36.8, respiratoryRate: 16, anomalyScore: 0.12
  });

  selectedPatient = computed(() =>
    this.patients().find(p => p.id === this.selectedPatientId()) || this.patients()[0]
  );

  wardPatients = computed(() =>
    this.patients().filter(p => p.status === 'Nội trú' || p.status === 'Khẩn cấp')
  );

  private charts: Chart[] = [];
  private subs: Subscription[] = [];
  private hrData: number[] = [];
  private spo2Data: number[] = [];
  private sysData: number[] = [];
  private diaData: number[] = [];
  private tempData: number[] = [];
  private labels: string[] = [];
  private readonly WINDOW = 60;

  constructor(private api: ApiService, private ws: WebSocketService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getPatients().subscribe(p => this.patients.set(p));
    for (let i = this.WINDOW; i > 0; i--) {
      this.labels.push(`-${i}s`);
      this.hrData.push(Math.floor(Math.random() * 15 + 82));
      this.spo2Data.push(Math.floor(Math.random() * 4 + 95));
      this.sysData.push(Math.floor(Math.random() * 20 + 115));
      this.diaData.push(Math.floor(Math.random() * 10 + 72));
      this.tempData.push(+(Math.random() * 0.8 + 36.2).toFixed(1));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      this.startLiveUpdates();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.charts.forEach(c => c.destroy());
  }

  selectPatient(id: string): void {
    this.selectedPatientId.set(id);
    this.toast.success(`Đang theo dõi bệnh nhân ${id}`);
  }

  setViewMode(mode: 'single' | 'ward'): void { this.viewMode.set(mode); }

  getVitalStatus(type: string): string {
    const v = this.currentVitals();
    if (type === 'hr') return v.heartRate > 100 || v.heartRate < 60 ? 'danger' : v.heartRate > 90 ? 'warning' : 'normal';
    if (type === 'spo2') return v.spO2 < 90 ? 'danger' : v.spO2 < 95 ? 'warning' : 'normal';
    if (type === 'bp') return v.systolicBP > 140 ? 'danger' : v.systolicBP > 130 ? 'warning' : 'normal';
    if (type === 'temp') return v.temperature > 38.5 ? 'danger' : v.temperature > 37.5 ? 'warning' : 'normal';
    return 'normal';
  }

  getWardStatus(p: Patient): string {
    if (p.riskLevel === 'Critical') return 'critical';
    if (p.riskLevel === 'High') return 'high';
    if (p.riskLevel === 'Medium') return 'warning';
    return 'normal';
  }

  private initCharts(): void {
    const lineOpts = (min: number, max: number, thresholdHigh?: number, thresholdLow?: number) => ({
      responsive: true, maintainAspectRatio: false, animation: { duration: 0 } as any,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min, max, grid: { color: '#f1f5f9' },
          ticks: { font: { size: 10 }, color: '#94a3b8' }
        },
        x: { display: false }
      },
      elements: { point: { radius: 0 }, line: { tension: 0.3, borderWidth: 2 } },
    });

    const hrCtx = this.hrCanvas?.nativeElement?.getContext('2d');
    if (hrCtx) {
      this.charts.push(new Chart(hrCtx, {
        type: 'line',
        data: {
          labels: [...this.labels],
          datasets: [{ data: [...this.hrData], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.06)', fill: true }]
        },
        options: lineOpts(50, 140) as any
      }));
    }
    const spo2Ctx = this.spo2Canvas?.nativeElement?.getContext('2d');
    if (spo2Ctx) {
      this.charts.push(new Chart(spo2Ctx, {
        type: 'line',
        data: {
          labels: [...this.labels],
          datasets: [{ data: [...this.spo2Data], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.06)', fill: true }]
        },
        options: lineOpts(85, 102) as any
      }));
    }
    const bpCtx = this.bpCanvas?.nativeElement?.getContext('2d');
    if (bpCtx) {
      this.charts.push(new Chart(bpCtx, {
        type: 'line',
        data: {
          labels: [...this.labels],
          datasets: [
            { data: [...this.sysData], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.06)', fill: true },
            { data: [...this.diaData], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.06)', fill: true },
          ]
        },
        options: lineOpts(50, 180) as any
      }));
    }
    const tempCtx = this.tempCanvas?.nativeElement?.getContext('2d');
    if (tempCtx) {
      this.charts.push(new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: [...this.labels],
          datasets: [{ data: [...this.tempData], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.06)', fill: true }]
        },
        options: lineOpts(35, 40) as any
      }));
    }
  }

  private startLiveUpdates(): void {
    this.subs.push(interval(2000).subscribe(() => {
      const hr = Math.floor(Math.random() * 18 + 82);
      const spo2 = Math.floor(Math.random() * 5 + 95);
      const sys = Math.floor(Math.random() * 25 + 115);
      const dia = Math.floor(Math.random() * 12 + 72);
      const temp = +(Math.random() * 1 + 36.2).toFixed(1);
      const rr = Math.floor(Math.random() * 6 + 14);

      this.currentVitals.set({ heartRate: hr, spO2: spo2, systolicBP: sys, diastolicBP: dia, temperature: temp, respiratoryRate: rr, anomalyScore: +(Math.random() * 0.3).toFixed(2) });

      this.hrData.push(hr); this.hrData.shift();
      this.spo2Data.push(spo2); this.spo2Data.shift();
      this.sysData.push(sys); this.sysData.shift();
      this.diaData.push(dia); this.diaData.shift();
      this.tempData.push(temp); this.tempData.shift();

      this.charts.forEach((c, i) => {
        if (i === 0) c.data.datasets[0].data = [...this.hrData];
        if (i === 1) c.data.datasets[0].data = [...this.spo2Data];
        if (i === 2) { c.data.datasets[0].data = [...this.sysData]; c.data.datasets[1].data = [...this.diaData]; }
        if (i === 3) c.data.datasets[0].data = [...this.tempData];
        c.update();
      });
    }));
  }
}
