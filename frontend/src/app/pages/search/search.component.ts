import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { SearchResult } from '../../core/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query = signal('');
  activeType = signal('all');

  results = signal<SearchResult[]>([]);
  isSearching = signal(false);
  hasSearched = signal(false);

  // Advanced Filters
  dateFrom = signal('');
  dateTo = signal('');
  minScore = signal(0);

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void { }

  setCategory(val: string): void {
    this.activeType.set(val);
    if (this.query().length >= 2) {
      this.doSearch();
    }
  }

  onSearchChange(): void {
    if (this.query().length >= 2) {
      this.doSearch();
    } else {
      this.results.set([]);
      this.hasSearched.set(false);
    }
  }

  doSearch(): void {
    if (!this.query().trim()) return;

    this.isSearching.set(true);
    this.hasSearched.set(true);

    setTimeout(() => {
      this.api.search(this.query(), this.activeType()).subscribe(res => {
        let filtered = res;
        if (this.minScore() > 0) {
          filtered = filtered.filter(r => r.score >= this.minScore());
        }

        // Mock adding some highlight if valid
        filtered = filtered.map(r => {
          if (!r.highlight && r.title.toLowerCase().includes(this.query().toLowerCase())) {
            const regex = new RegExp(`(${this.query()})`, 'gi');
            r.highlight = `... ${r.title.replace(regex, '<em>$1</em>')} ...`;
          } else if (!r.highlight) {
            r.highlight = r.subtitle;
          }
          return r;
        });

        this.results.set(filtered);
        this.isSearching.set(false);
      });
    }, 400); // Simulate network latency
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'patient': return 'fa-user';
      case 'drug': return 'fa-pills';
      case 'icd10': return 'fa-stethoscope';
      case 'doctor': return 'fa-user-doctor';
      case 'ehr': return 'fa-file-medical';
      default: return 'fa-file';
    }
  }

  getColorForType(type: string): string {
    switch (type) {
      case 'patient': return '#3b82f6';
      case 'drug': return '#10b981';
      case 'icd10': return '#f59e0b';
      case 'doctor': return '#06b6d4';
      case 'ehr': return '#8b5cf6';
      default: return '#64748b';
    }
  }
}
