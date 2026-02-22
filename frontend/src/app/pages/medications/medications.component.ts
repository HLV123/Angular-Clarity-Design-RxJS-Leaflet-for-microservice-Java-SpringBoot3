import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Drug, DrugInteraction } from '../../core/models';

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.scss']
})
export class MedicationsComponent implements OnInit {
  drugs = signal<Drug[]>([]);

  // Interaction checker state
  selectedDrug1 = signal<string>('');
  selectedDrug2 = signal<string>('');
  interactions = signal<DrugInteraction[] | null>(null);
  isChecking = signal(false);

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getDrugs().subscribe(d => this.drugs.set(d));
  }

  checkInteraction(): void {
    if (!this.selectedDrug1() || !this.selectedDrug2()) {
      this.toast.warning('Vui lòng chọn 2 loại thuốc để kiểm tra');
      return;
    }
    if (this.selectedDrug1() === this.selectedDrug2()) {
      this.toast.warning('Vui lòng chọn 2 loại thuốc khác nhau');
      return;
    }

    this.isChecking.set(true);

    const d1 = this.drugs().find(d => d.id === this.selectedDrug1());
    const d2 = this.drugs().find(d => d.id === this.selectedDrug2());

    if (d1 && d2) {
      this.api.checkDrugInteraction(d1.genericName, d2.genericName).subscribe(res => {
        this.interactions.set(res);
        this.isChecking.set(false);
        if (res.length > 0) {
          const hasMajor = res.some(r => r.severity === 'MAJOR');
          if (hasMajor) {
            this.toast.error('Phát hiện cảnh báo tương tác thuốc mức độ NGIÊM TRỌNG!');
          } else {
            this.toast.warning('Phát hiện có tương tác thuốc!');
          }
        } else {
          this.toast.success('Không tìm thấy tương tác giữa 2 loại thuốc này');
        }
      });
    }
  }

  swapDrugs(): void {
    const temp = this.selectedDrug1();
    this.selectedDrug1.set(this.selectedDrug2());
    this.selectedDrug2.set(temp);
  }
}
