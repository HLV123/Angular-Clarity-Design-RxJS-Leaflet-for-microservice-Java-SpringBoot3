import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast" [class]="'toast-' + t.type" (click)="toastService.remove(t.id)">
          <i [class]="getIcon(t.type)"></i>
          <span>{{ t.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; }
    .toast {
      padding: 14px 20px; border-radius: 10px; color: #fff; font-size: 13px;
      font-weight: 500; display: flex; align-items: center; gap: 10px; cursor: pointer;
      box-shadow: 0 8px 30px rgba(0,0,0,.2); max-width: 420px;
      animation: slideIn .3s ease;
    }
    .toast-success { background: linear-gradient(135deg, #059669, #10b981); }
    .toast-error { background: linear-gradient(135deg, #dc2626, #ef4444); }
    .toast-warning { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .toast-critical { background: linear-gradient(135deg, #dc2626, #ef4444); }
    @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
  getIcon(type: string): string {
    const m: Record<string, string> = { success: 'fa-solid fa-check-circle', error: 'fa-solid fa-times-circle', warning: 'fa-solid fa-exclamation-triangle', critical: 'fa-solid fa-heart-pulse' };
    return m[type] || 'fa-solid fa-info-circle';
  }
}
