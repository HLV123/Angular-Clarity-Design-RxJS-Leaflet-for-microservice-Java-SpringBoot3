import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="app-layout">
      <app-sidebar #sidebar></app-sidebar>
      <main class="main-content">
        <app-header (toggleSidebar)="sidebar.toggle()"></app-header>
        <div class="page-container">
          <router-outlet></router-outlet>
        </div>
      </main>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; overflow: hidden; }
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .page-container { flex: 1; overflow-y: auto; padding: 24px; background: #f0f4f8; }
  `]
})
export class MainLayoutComponent {}
