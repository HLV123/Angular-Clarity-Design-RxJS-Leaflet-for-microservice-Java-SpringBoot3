import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { ToastService } from '../../core/services/toast.service';
import { Alert } from '../../core/models';
import { Subscription, interval } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vitalsCanvas') vitalsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('triageCanvas') triageCanvas!: ElementRef<HTMLCanvasElement>;

  currentTime = signal('');
  alerts = signal<Alert[]>([]);
  private vitalsChart?: Chart;
  private subs: Subscription[] = [];

  stats = [
    { label: 'Bệnh nhân nội trú', value: '124', change: '+12%', icon: 'fa-hospital-user', color: '#1574ea', positive: true },
    { label: 'Cảnh báo khẩn (Kafka)', value: '3', change: 'Cần xử lý ngay', icon: 'fa-heart-pulse', color: '#ef4444', positive: false },
    { label: 'AI Triage (Đỏ/Cam)', value: '18', change: 'Ca chờ khám', icon: 'fa-robot', color: '#8b5cf6', positive: false },
    { label: 'Giường trống', value: '28%', change: '42/150 giường', icon: 'fa-bed', color: '#10b981', positive: true },
  ];

  constructor(
    private api: ApiService,
    private ws: WebSocketService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getAlerts().subscribe(a => this.alerts.set(a.slice(0, 4)));
    this.subs.push(interval(1000).subscribe(() => {
      this.currentTime.set(new Date().toLocaleString('vi-VN'));
    }));
    setTimeout(() => this.toast.success('Đăng nhập thành công. WebSocket đã kết nối.'), 500);
    setTimeout(() => this.toast.critical('⚠️ SpO2 BN Nguyễn Văn An giảm xuống 88%!'), 4000);
  }

  ngAfterViewInit(): void {
    this.initVitalsChart();
    this.initTriageChart();
    this.startLiveUpdates();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.vitalsChart?.destroy();
  }

  private initVitalsChart(): void {
    const ctx = this.vitalsCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const labels = Array.from({ length: 20 }, (_, i) => `-${20 - i}s`);
    this.vitalsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Nhịp tim (bpm)', data: labels.map(() => Math.floor(Math.random() * 20 + 82)), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', borderWidth: 2, tension: .4, fill: true, pointRadius: 0 },
          { label: 'SpO2 (%)', data: labels.map(() => Math.floor(Math.random() * 5 + 95)), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', borderWidth: 2, tension: .4, fill: true, pointRadius: 0 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6, font: { size: 11 } } } },
        scales: { y: { min: 60, max: 120, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
        animation: { duration: 0 }
      }
    });
  }

  private initTriageChart(): void {
    const ctx = this.triageCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Immediate', 'Very Urgent', 'Urgent', 'Standard', 'Non-urgent'],
        datasets: [{ data: [5, 8, 15, 22, 10], backgroundColor: ['#dc2626', '#ea580c', '#eab308', '#22c55e', '#3b82f6'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, padding: 12 } } }
      }
    });
  }

  private startLiveUpdates(): void {
    this.subs.push(interval(1500).subscribe(() => {
      if (!this.vitalsChart) return;
      this.vitalsChart.data.labels!.shift();
      this.vitalsChart.data.labels!.push('Live');
      this.vitalsChart.data.datasets[0].data.shift();
      this.vitalsChart.data.datasets[0].data.push(Math.floor(Math.random() * 20 + 82));
      this.vitalsChart.data.datasets[1].data.shift();
      this.vitalsChart.data.datasets[1].data.push(Math.floor(Math.random() * 5 + 95));
      this.vitalsChart.update();
    }));
  }

  getLevelClass(level: string): string {
    return ({ CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low' } as any)[level] || '';
  }
}
