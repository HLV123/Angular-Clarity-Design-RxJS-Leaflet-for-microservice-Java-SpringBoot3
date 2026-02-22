import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { HospitalLocation } from '../../core/models';
import * as L from 'leaflet';

@Component({
  selector: 'app-gis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gis.component.html',
  styleUrls: ['./gis.component.scss']
})
export class GisComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapContainer!: ElementRef;
  private map: L.Map | undefined;
  hospitals = signal<HospitalLocation[]>([]);

  constructor(
    private api: ApiService,
    public toast: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.api.getHospitals().subscribe(data => {
      this.hospitals.set(data);
      if (this.map) {
        this.addMarkers(data);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) return;

    // Default icon hack for Leaflet in Angular
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    this.map = L.map(this.mapContainer.nativeElement).setView([21.0285, 105.8542], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    if (this.hospitals().length > 0) {
      this.addMarkers(this.hospitals());
    }
  }

  private addMarkers(hospitals: HospitalLocation[]): void {
    if (!this.map) return;

    hospitals.forEach(h => {
      const marker = L.marker([h.location.lat, h.location.lng]).addTo(this.map!);

      const popupContent = `
        <div class="gis-popup">
          <h4 style="margin:0 0 4px 0;font-size:14px;color:#0f172a">${h.name}</h4>
          <p style="margin:0 0 8px 0;font-size:12px;color:#64748b;line-height:1.4">${h.address}</p>
          <div style="display:flex;gap:12px;font-size:12px;margin-bottom:8px">
            <span><i class="fa-solid fa-bed" style="color:#3b82f6"></i> ${h.beds} giường</span>
            <span style="color:#10b981;font-weight:600;text-transform:uppercase">${h.type}</span>
          </div>
          <div style="font-size:11px;color:#475569;display:flex;flex-wrap:wrap;gap:4px">
            ${h.specialties.map(s => `<span style="background:#f1f5f9;padding:2px 6px;border-radius:4px">${s}</span>`).join('')}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }

  panToHospital(h: HospitalLocation): void {
    if (this.map) {
      this.map.flyTo([h.location.lat, h.location.lng], 15, { duration: 1 });
    }
  }
}
