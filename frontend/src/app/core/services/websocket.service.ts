import { Injectable, signal } from '@angular/core';
import { Observable, Subject, interval, map } from 'rxjs';
import { VitalStreamMessage } from '../models';

/**
 * Mock WebSocket/STOMP service
 * In production: connects to Spring WebSocket via SockJS + STOMP
 * Topics: /topic/patient/{id}/vitals, /topic/patient/{id}/alerts, etc.
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  connected = signal(true);
  private vitalSubject = new Subject<VitalStreamMessage>();

  constructor() {
    // Simulate STOMP messages every 2s
    interval(2000).subscribe(() => {
      this.vitalSubject.next(this.generateMockVitals('P-0042'));
    });
  }

  subscribeVitals(patientId: string): Observable<VitalStreamMessage> {
    return this.vitalSubject.asObservable().pipe(
      map(v => ({ ...v, patientId }))
    );
  }

  private generateMockVitals(patientId: string): VitalStreamMessage {
    return {
      patientId,
      timestamp: new Date().toISOString(),
      deviceId: 'IOT-WR-001',
      vitals: {
        heartRate: Math.floor(Math.random() * 20 + 82),
        systolicBP: Math.floor(Math.random() * 25 + 115),
        diastolicBP: Math.floor(Math.random() * 10 + 72),
        spO2: Math.floor(Math.random() * 5 + 95),
        temperature: +(Math.random() * 1 + 36.2).toFixed(1),
        respiratoryRate: Math.floor(Math.random() * 6 + 14),
      },
      status: 'NORMAL',
      anomalyScore: +(Math.random() * 0.3).toFixed(2)
    };
  }

  disconnect(): void {
    this.connected.set(false);
  }
}
