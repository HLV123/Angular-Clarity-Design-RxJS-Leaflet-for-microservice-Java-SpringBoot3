import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },

      // Lâm sàng
      { path: 'patients', loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE')] },
      { path: 'monitoring', loadComponent: () => import('./pages/monitoring/monitoring.component').then(m => m.MonitoringComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE')] },
      { path: 'ehr', loadComponent: () => import('./pages/ehr/ehr.component').then(m => m.EhrComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE')] },
      { path: 'appointments', loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT')] },

      // AI & Dữ liệu
      { path: 'ai-diagnosis', loadComponent: () => import('./pages/ai-diagnosis/ai-diagnosis.component').then(m => m.AiDiagnosisComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR')] },
      { path: 'knowledge-graph', loadComponent: () => import('./pages/knowledge-graph/knowledge-graph.component').then(m => m.KnowledgeGraphComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'DATA_ANALYST')] },
      { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent), canActivate: [roleGuard('ADMIN', 'DATA_ANALYST')] },

      // Dược & Thiết bị
      { path: 'medications', loadComponent: () => import('./pages/medications/medications.component').then(m => m.MedicationsComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'PHARMACIST', 'NURSE')] },
      { path: 'devices', loadComponent: () => import('./pages/devices/devices.component').then(m => m.DevicesComponent), canActivate: [roleGuard('ADMIN', 'NURSE', 'DOCTOR')] },

      // Hệ thống
      { path: 'alerts', loadComponent: () => import('./pages/alerts/alerts.component').then(m => m.AlertsComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE')] },
      { path: 'storage', loadComponent: () => import('./pages/storage/storage.component').then(m => m.StorageComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE')] },
      { path: 'gis', loadComponent: () => import('./pages/gis/gis.component').then(m => m.GisComponent), canActivate: [roleGuard('ADMIN', 'DATA_ANALYST', 'DOCTOR')] },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent), canActivate: [roleGuard('ADMIN')] },
      { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent), canActivate: [roleGuard('ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST')] },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
