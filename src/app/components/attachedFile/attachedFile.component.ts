import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageViewerModalComponent } from './image-viewer.component';

interface AttachedFile {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  thumbnail?: string;
}

@Component({
  selector: 'app-attachment-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <div class="attachments-section">
      <div class="section-header">
        <div class="header-title">
          <mat-icon>attach_file</mat-icon>
          <h3>Anexos</h3>
          <span class="count">{{ files().length }}</span>
        </div>
        <button 
          mat-stroked-button 
          (click)="onAddAttachment()"
          class="add-button">
          <mat-icon>add</mat-icon>
          Adicionar
        </button>
      </div>

      @if (files().length === 0) {
        <div class="empty-state">
          <mat-icon>image</mat-icon>
          <p>Nenhum arquivo anexado</p>
          <span>Clique em "Adicionar" para anexar arquivos</span>
        </div>
      } @else {
        <div class="attachments-grid">
          @for (file of files(); track file.id) {
            <div class="attachment-card" (click)="onFileClick(file)">
              <!-- Preview de Imagem -->
              @if (isImage(file.mimeType)) {
                <div class="image-preview">
                  <img [src]="file.url" [alt]="file.originalName">
                  <div class="image-overlay">
                    <button 
                      mat-icon-button 
                      class="overlay-button"
                      (click)="onDownload(file, $event)"
                      matTooltip="Baixar">
                      <mat-icon>download</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      class="overlay-button"
                      (click)="onDelete(file, $event)"
                      matTooltip="Remover">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              } @else {
                <!-- Preview de Documento -->
                <div class="document-preview">
                  <mat-icon class="doc-icon">{{ getFileIcon(file.mimeType) }}</mat-icon>
                  <div class="document-overlay">
                    <button 
                      mat-icon-button 
                      class="overlay-button"
                      (click)="onDownload(file, $event)"
                      matTooltip="Baixar">
                      <mat-icon>download</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      class="overlay-button"
                      (click)="onDelete(file, $event)"
                      matTooltip="Remover">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              }

              <!-- Informações do Arquivo -->
              <div class="file-info">
                <div class="file-name" [matTooltip]="file.originalName">
                  {{ file.originalName }}
                </div>
                <div class="file-meta">
                  <span class="file-date">
                    {{ formatDate(file.createdAt) }}
                  </span>
                  <span class="file-size">
                    {{ formatFileSize(file.size) }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .attachments-section {
      margin: 16px 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .header-title {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          color: #666;
        }

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .count {
          background: #e0e0e0;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #666;
        }
      }

      .add-button {
        display: none;
        align-items: center;
        gap: 4px;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ccc;
        margin-bottom: 12px;
      }

      p {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 500;
        color: #666;
      }

      span {
        font-size: 14px;
        color: #999;
      }
    }

    .attachments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .attachment-card {
      background: var(--grey-background);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);

        .image-overlay,
        .document-overlay {
          opacity: 1;
        }
      }
    }

    .image-preview,
    .document-preview {
      position: relative;
      width: 100%;
      height: 160px;
      overflow: hidden;
      background: var(--grey-background);
    }

    .image-preview {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .document-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .doc-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: white;
      }
    }

    .image-overlay,
    .document-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
      backdrop-filter: blur(2px);

      .overlay-button {
        background: white;
        color: #333;
        width: 40px;
        height: 40px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &:hover {
          background: #f0f0f0;
        }
      }
    }

    .file-info {
      padding: 12px;
      background: white;

      .file-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
      }

      .file-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: black;

        .file-date {
        color: black;
          flex: 1;
        }

        .file-size {
                    color: black;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 768px) {
      .attachments-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }

      .image-preview,
      .document-preview {
        height: 120px;
      }
    }
  `]
})
export class AttachmentGalleryComponent {
  files = input.required<AttachedFile[]>();
  
  addAttachment = output<void>();
  fileClick = output<AttachedFile>();
  fileDownload = output<AttachedFile>();
  fileDelete = output<AttachedFile>();

  isImage(type: string): boolean {
    return type.startsWith('image/');
  }

  getFileIcon(type: string): string {
    if (type === 'application/pdf') return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('excel') || type.includes('sheet')) return 'table_chart';
    if (type.includes('zip') || type.includes('rar')) return 'folder_zip';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days}d atrás`;
    
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  }

  onAddAttachment(): void {
    this.addAttachment.emit();
  }
  readonly dialog = inject(MatDialog);

  onFileClick(file: AttachedFile): void {
    console.log(file);
     this.dialog.open(ImageViewerModalComponent, {
          data: file,
          maxWidth: '90vw',
          maxHeight: '90vh',
          panelClass: 'image-viewer-dialog'
        });
    this.fileClick.emit(file);
  }

  onDownload(file: AttachedFile, event: Event): void {
    event.stopPropagation();
    this.fileDownload.emit(file);
  }

  onDelete(file: AttachedFile, event: Event): void {
    event.stopPropagation();
    this.fileDelete.emit(file);
  }
}