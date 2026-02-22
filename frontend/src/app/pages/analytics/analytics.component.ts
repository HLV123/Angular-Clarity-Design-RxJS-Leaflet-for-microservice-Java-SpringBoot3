import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import {
  MONTHLY_VISITS, TOP_DISEASES, BED_OCCUPANCY, WEEKLY_REVENUE
} from '../../core/mock-data/analytics.data';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart1') chart1!: ElementRef;
  @ViewChild('chart2') chart2!: ElementRef;
  @ViewChild('chart3') chart3!: ElementRef;
  @ViewChild('chart4') chart4!: ElementRef;
  @ViewChild('chart5') chart5!: ElementRef;
  @ViewChild('chart6') chart6!: ElementRef;
  @ViewChild('chart7') chart7!: ElementRef;
  @ViewChild('chart8') chart8!: ElementRef;

  charts: Chart[] = [];

  stats = { visits: 156, waitTime: 23, readmission: 4.2, satisfaction: 4.6 };

  constructor(private api: ApiService) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts(), 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  initCharts(): void {
    if (!this.chart1) return; // Prevent errors if DOM isn't ready

    // 1. Visit Bar Chart
    this.charts.push(new Chart(this.chart1.nativeElement, {
      type: 'bar',
      data: {
        labels: MONTHLY_VISITS.map(d => d.month),
        datasets: [{ label: 'Lượt khám', data: MONTHLY_VISITS.map(d => d.visits), backgroundColor: '#3b82f6', borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }));

    // 2. Top Diseases Horizontal Bar
    this.charts.push(new Chart(this.chart2.nativeElement, {
      type: 'bar',
      data: {
        labels: TOP_DISEASES.slice(0, 5).map(d => d.name.split(' (')[0]),
        datasets: [{ label: 'Số ca', data: TOP_DISEASES.slice(0, 5).map(d => d.count), backgroundColor: '#10b981', borderRadius: 4 }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }));

    // 3. Bed Occupancy Stacked
    this.charts.push(new Chart(this.chart3.nativeElement, {
      type: 'bar',
      data: {
        labels: BED_OCCUPANCY.map(d => d.dept),
        datasets: [
          { label: 'Đang dùng', data: BED_OCCUPANCY.map(d => d.used), backgroundColor: '#f59e0b' },
          { label: 'Trống', data: BED_OCCUPANCY.map(d => d.total - d.used), backgroundColor: '#e2e8f0' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true } }
      }
    }));

    // 4. Weekly Revenue Line
    this.charts.push(new Chart(this.chart4.nativeElement, {
      type: 'line',
      data: {
        labels: WEEKLY_REVENUE.map(d => d.day),
        datasets: [{ label: 'Doanh thu (Tr VNĐ)', data: WEEKLY_REVENUE.map(d => d.amount), borderColor: '#8b5cf6', fill: true, backgroundColor: 'rgba(139,92,246,0.1)', tension: 0.4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }));

    // 5. Patient Demographics Doughnut
    this.charts.push(new Chart(this.chart5.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Dưới 18', '18-40', '41-60', 'Trên 60'],
        datasets: [{ data: [15, 30, 35, 20], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
    }));

    // 6. Alert Levels Pie
    this.charts.push(new Chart(this.chart6.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{ data: [12, 18, 45, 25], backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    }));

    // 7. IoT Device Status Polar Area
    this.charts.push(new Chart(this.chart7.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Online', 'Offline', 'Warning', 'Maintenance'],
        datasets: [{ data: [85, 5, 8, 2], backgroundColor: ['#10b981', '#64748b', '#f59e0b', '#8b5cf6'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    }));

    // 8. Doctor Performance Radar
    this.charts.push(new Chart(this.chart8.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Chuyên môn', 'Thái độ', 'Đúng giờ', 'Hồ sơ', 'Nghiên cứu'],
        datasets: [
          { label: 'TT Nhóm', data: [85, 90, 80, 85, 70], borderColor: '#cbd5e1', backgroundColor: 'rgba(203,213,225,0.2)' },
          { label: 'BS. Duy', data: [95, 98, 90, 95, 85], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    }));
  }
}
