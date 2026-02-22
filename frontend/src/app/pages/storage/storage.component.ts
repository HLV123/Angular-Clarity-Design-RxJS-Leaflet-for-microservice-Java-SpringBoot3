import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { StorageFile } from '../../core/models';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
  files = signal<StorageFile[]>([]);
  selectedFile = signal<StorageFile | null>(null);

  isUploading = signal(false);
  showUploadModal = signal(false);

  stats = { totalSize: '435.5 MB', xrays: 1, dicoms: 2, pdfs: 2, others: 1 };

  constructor(private api: ApiService, public toast: ToastService) { }

  ngOnInit(): void {
    this.api.getStorageFiles().subscribe(f => {
      this.files.set(f);
      const dicoms = f.filter(x => x.mimeType === 'application/dicom').length;
      const pdfs = f.filter(x => x.mimeType === 'application/pdf').length;
      const xrays = f.filter(x => x.fileType === 'X-Ray').length;
      this.stats.dicoms = dicoms;
      this.stats.pdfs = pdfs;
      this.stats.xrays = xrays;
    });
  }

  selectFile(f: StorageFile): void {
    this.selectedFile.set(f);
  }

  openUpload(): void {
    this.showUploadModal.set(true);
  }

  closeUpload(): void {
    this.showUploadModal.set(false);
  }

  simulateUpload(event: any): void {
    const fileList = event.target.files;
    if (fileList.length > 0) {
      this.isUploading.set(true);
      setTimeout(() => {
        this.isUploading.set(false);
        this.closeUpload();
        this.toast.success(`Đã tải lên ${fileList[0].name} thành công (vào Ceph S3)`);
      }, 1500);
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    if (type.includes('DICOM') || type.includes('CT') || type.includes('MRI')) return 'fa-brain';
    if (type.includes('X-Ray')) return 'fa-x-ray';
    if (type.includes('PDF') || type.includes('Report')) return 'fa-file-pdf';
    if (type.includes('Siêu âm')) return 'fa-video';
    return 'fa-file-medical';
  }
}
