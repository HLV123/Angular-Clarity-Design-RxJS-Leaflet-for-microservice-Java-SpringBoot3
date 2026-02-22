import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { DiagnosisSuggestion, Patient } from '../../core/models';

@Component({
  selector: 'app-ai-diagnosis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-diagnosis.component.html',
  styleUrls: ['./ai-diagnosis.component.scss']
})
export class AiDiagnosisComponent implements OnInit {
  // Symptom Checker
  symptoms = signal('');
  selectedPatientId = signal('');
  patients = signal<Patient[]>([]);
  isAnalyzing = signal(false);
  hasResult = signal(false);

  // AI Response
  suggestions = signal<DiagnosisSuggestion[]>([]);
  confidence = signal(0);
  recommendation = signal('');
  triageLevel = signal('');

  // Triage Stats (mock)
  triageStats = [
    { level: 'IMMEDIATE', label: 'Immediate', count: 5, color: '#dc2626', bg: '#fef2f2' },
    { level: 'VERY_URGENT', label: 'Very Urgent', count: 8, color: '#ea580c', bg: '#fff7ed' },
    { level: 'URGENT', label: 'Urgent', count: 15, color: '#ca8a04', bg: '#fefce8' },
    { level: 'STANDARD', label: 'Standard', count: 22, color: '#16a34a', bg: '#f0fdf4' },
    { level: 'NON_URGENT', label: 'Non-urgent', count: 10, color: '#2563eb', bg: '#eff6ff' },
  ];

  // X-Ray Upload
  xrayFile = signal<string | null>(null);
  isAnalyzingXray = signal(false);
  xrayResult = signal<string | null>(null);

  // ECG
  ecgStatus = signal<'idle' | 'analyzing' | 'done'>('idle');
  ecgResult = signal('');

  // Risk Predictor
  riskScore = signal<number | null>(null);
  riskFactors = signal<string[]>([]);

  // History
  analysisHistory = signal<Array<{ timestamp: string; symptoms: string; topResult: string; confidence: number }>>([]);

  constructor(private api: ApiService, public toast: ToastService) {}

  ngOnInit(): void {
    this.api.getPatients().subscribe(p => this.patients.set(p));
  }

  runSymptomCheck(): void {
    const s = this.symptoms().trim();
    if (!s) {
      this.toast.warning('Vui lòng nhập triệu chứng lâm sàng');
      return;
    }
    this.isAnalyzing.set(true);
    this.hasResult.set(false);

    this.api.runSymptomCheck(s).subscribe(response => {
      this.suggestions.set(response.suggestions);
      this.confidence.set(response.confidence);
      this.recommendation.set(response.recommendation);
      this.triageLevel.set(response.triageLevel);
      this.hasResult.set(true);
      this.isAnalyzing.set(false);

      // Add to history
      this.analysisHistory.update(h => [{
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        symptoms: s.substring(0, 50) + (s.length > 50 ? '...' : ''),
        topResult: response.suggestions[0]?.diseaseName || '-',
        confidence: response.suggestions[0]?.probability || 0
      }, ...h].slice(0, 10));

      this.toast.success('AI đã hoàn thành phân tích (gRPC → ml-service)');
    });
  }

  simulateXrayAnalysis(): void {
    this.isAnalyzingXray.set(true);
    this.xrayResult.set(null);
    setTimeout(() => {
      this.xrayResult.set('Phát hiện mờ phổi phải vùng đáy — nghi ngờ viêm phổi (Confidence: 87%). Khuyến nghị: chụp CT ngực, xét nghiệm CRP, cấy đàm.');
      this.isAnalyzingXray.set(false);
      this.toast.success('X-Ray Analyzer hoàn thành (CNN Model v2.3)');
    }, 2000);
  }

  simulateECG(): void {
    this.ecgStatus.set('analyzing');
    this.ecgResult.set('');
    setTimeout(() => {
      this.ecgResult.set('Nhịp xoang bình thường, HR 78 bpm. Không phát hiện rung nhĩ hay block. QTc: 420ms (bình thường).');
      this.ecgStatus.set('done');
      this.toast.success('ECG Classifier hoàn thành (LSTM Model v1.8)');
    }, 1800);
  }

  simulateRiskPredictor(): void {
    if (!this.selectedPatientId()) {
      this.toast.warning('Vui lòng chọn bệnh nhân để dự đoán nguy cơ');
      return;
    }
    this.riskScore.set(null);
    this.riskFactors.set([]);
    setTimeout(() => {
      this.riskScore.set(0.72);
      this.riskFactors.set([
        'Tuổi > 60 (+0.15)',
        'Tiền sử tim mạch (+0.25)',
        'HbA1c > 7% (+0.12)',
        'Huyết áp tâm thu > 140 (+0.10)',
        'Hút thuốc (+0.10)'
      ]);
      this.toast.success('Risk Predictor hoàn thành (XGBoost Model v3.1)');
    }, 1500);
  }

  getTriageBadgeClass(level: string): string {
    const m: Record<string, string> = {
      IMMEDIATE: 'triage-immediate', VERY_URGENT: 'triage-very-urgent',
      URGENT: 'triage-urgent', STANDARD: 'triage-standard', NON_URGENT: 'triage-non-urgent'
    };
    return m[level] || '';
  }

  getProbabilityColor(p: number): string {
    if (p >= 0.8) return '#dc2626';
    if (p >= 0.6) return '#ea580c';
    if (p >= 0.4) return '#ca8a04';
    return '#16a34a';
  }

  clearResults(): void {
    this.symptoms.set('');
    this.hasResult.set(false);
    this.suggestions.set([]);
  }
}
