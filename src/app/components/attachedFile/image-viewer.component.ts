import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

interface AttachedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  thumbnail?: string;
}

@Component({
  selector: 'app-image-viewer-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="image-viewer">
      <div class="viewer-header">
        <div class="file-info">
          <h2>{{ file.name }}</h2>
          <span>{{ formatFileSize(file.size) }}</span>
        </div>
        <div class="actions">
          <button mat-icon-button (click)="onDownload()">
            <mat-icon>download</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close>
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="viewer-content">
        @if (isImage(file.type)) {
          <img [src]="file.url" [alt]="file.name">
        } @else {
          <div class="document-view">
            <mat-icon>{{ getFileIcon(file.type) }}</mat-icon>
            <p>{{ file.name }}</p>
            <button mat-raised-button color="primary" (click)="onDownload()">
              <mat-icon>download</mat-icon>
              Baixar Arquivo
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .image-viewer {
      display: flex;
      flex-direction: column;
      height: 90vh;
      max-height: 800px;
    }

    .viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;

      .file-info {
        h2 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
        }

        span {
          font-size: 14px;
          color: #666;
        }
      }

      .actions {
        display: flex;
        gap: 8px;
      }
    }

    .viewer-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #f5f5f5;
      overflow: auto;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .document-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        mat-icon {
          font-size: 80px;
          width: 80px;
          height: 80px;
          color: #666;
        }

        p {
          font-size: 16px;
          color: #666;
          text-align: center;
        }
      }
    }
  `]
})
export class ImageViewerModalComponent {
    readonly data = inject<any>(MAT_DIALOG_DATA);

  file = this.data;

  isImage(type: string): boolean {
    return type.startsWith('image/');
  }

  getFileIcon(type: string): string {
    if (type === 'application/pdf') return 'picture_as_pdf';
    if (type.includes('word')) return 'description';
    if (type.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onDownload(): void {
    window.open(this.file.url, '_blank');
  }
}