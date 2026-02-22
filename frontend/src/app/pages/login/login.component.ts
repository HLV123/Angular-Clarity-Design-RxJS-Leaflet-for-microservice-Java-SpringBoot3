import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = 'admin';
  password = 'admin123';
  error = signal(false);
  loading = signal(false);

  demoAccounts = [
    { user: 'admin', pass: 'admin123', role: 'Quản trị viên' },
    { user: 'doctor', pass: 'doctor123', role: 'Bác sĩ' },
    { user: 'nurse', pass: 'nurse123', role: 'Điều dưỡng' },
    { user: 'pharmacist', pass: 'pharma123', role: 'Dược sĩ' },
    { user: 'patient', pass: 'patient123', role: 'Bệnh nhân' },
    { user: 'analyst', pass: 'analyst123', role: 'Phân tích' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.loading.set(true);
    this.error.set(false);
    setTimeout(() => {
      if (this.auth.login({ username: this.username, password: this.password })) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set(true);
      }
      this.loading.set(false);
    }, 600);
  }

  fillDemo(user: string, pass: string): void {
    this.username = user;
    this.password = pass;
  }
}
