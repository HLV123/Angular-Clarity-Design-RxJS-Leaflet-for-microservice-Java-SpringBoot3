import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'critical';
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'success', duration = 4000): void {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, message, type, duration }]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error', 6000); }
  warning(msg: string) { this.show(msg, 'warning', 5000); }
  critical(msg: string) { this.show(msg, 'critical', 8000); }
}
