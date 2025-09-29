import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface FileUploadData {
  file: File;
  arrayBuffer: ArrayBuffer;
  base64: string;
  preview?: string;
}

@Component({
  selector: 'app-file-upload-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="file-upload-modal">
      <div class="modal-header">
        <h2 mat-dialog-title>
          <mat-icon>attach_file</mat-icon>
          Upload de Arquivo
        </h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="modal-content">
        <!-- Área de Upload -->
        <div 
          class="upload-area"
          [class.dragging]="isDragging()"
          [class.has-file]="selectedFile()"
          [class.uploading]="isUploading()"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)">
          
          <!-- Estado: Aguardando arquivo -->
          @if (!selectedFile() && !isUploading()) {
            <div class="upload-prompt">
              <mat-icon class="upload-icon">cloud_upload</mat-icon>
              <p class="primary-text">Clique ou arraste um arquivo aqui</p>
              <p class="secondary-text">Formatos suportados: Imagens, PDFs, Documentos</p>
              <p class="size-limit">Tamanho máximo: 10MB</p>
            </div>
          }

          <!-- Estado: Fazendo upload -->
          @if (isUploading()) {
            <div class="uploading-state">
              <mat-spinner diameter="60"></mat-spinner>
              <p class="uploading-text">Processando arquivo...</p>
              <p class="file-name">{{ uploadingFileName() }}</p>
            </div>
          }

          <!-- Estado: Arquivo selecionado -->
          @if (selectedFile() && !isUploading()) {
            <div class="file-preview">
              @if (filePreview()) {
                <img [src]="filePreview()" alt="Preview" class="preview-image">
              } @else {
                <div class="file-icon-preview">
                  <mat-icon class="large-icon">{{ getFileIcon() }}</mat-icon>
                </div>
              }
              
              <div class="file-details">
                <p class="file-name">{{ selectedFile()?.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
                <p class="file-type">{{ selectedFile()?.type || 'Tipo desconhecido' }}</p>
              </div>

              <button 
                mat-icon-button 
                class="remove-file"
                (click)="removeFile($event)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>

        <!-- Input oculto -->
        <input
          #fileInput
          type="file"
          (change)="onFileSelected($event)"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          style="display: none;">

        <!-- Mensagem de erro -->
        @if (errorMessage()) {
          <div class="error-message">
            <mat-icon>error</mat-icon>
            {{ errorMessage() }}
          </div>
        }
      </div>

      <div mat-dialog-actions class="modal-actions">
        <button mat-stroked-button (click)="onCancel()">
          Cancelar
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!selectedFile() || isUploading()"
          (click)="onConfirm()">
          <mat-icon>check</mat-icon>
          Confirmar
        </button>
      </div>
    </div>
  `,
  styleUrl: './attach-file-modal.component.scss'
})
export class FileUploadModalComponent {
  private dialogRef = inject(MatDialogRef<FileUploadModalComponent>);

  selectedFile = signal<File | null>(null);
  filePreview = signal<string | null>(null);
  isDragging = signal(false);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  uploadingFileName = signal<string>('');

  fileUploaded = output<FileUploadData>();

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private async processFile(file: File): Promise<void> {
    this.errorMessage.set(null);

    if (file.size > this.MAX_FILE_SIZE) {
      this.errorMessage.set('Arquivo muito grande. Tamanho máximo: 10MB');
      return;
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.errorMessage.set('Tipo de arquivo não suportado');
      return;
    }

    this.isUploading.set(true);
    this.uploadingFileName.set(file.name);
    this.selectedFile.set(file);

    try {
      await this.delay(1000);

      if (file.type.startsWith('image/')) {
        const preview = await this.generatePreview(file);
        this.filePreview.set(preview);
      }

      this.isUploading.set(false);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      this.errorMessage.set('Erro ao processar arquivo');
      this.isUploading.set(false);
      this.selectedFile.set(null);
    }
  }

  private generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.filePreview.set(null);
    this.errorMessage.set(null);
  }

  async onConfirm(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    try {
      const arrayBuffer = await this.fileToArrayBuffer(file);
      
      const base64 = await this.fileToBase64(file);

      const uploadData: FileUploadData = {
        file: file,
        arrayBuffer: arrayBuffer,
        base64: base64,
        //@ts-expect-error
        preview: this.filePreview()
      };

      this.dialogRef.close(uploadData);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      this.errorMessage.set('Erro ao processar arquivo para upload');
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as ArrayBuffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(): string {
    const file = this.selectedFile();
    if (!file) return 'insert_drive_file';

    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'picture_as_pdf';
    if (file.type.includes('word')) return 'description';
    if (file.type.includes('excel') || file.type.includes('sheet')) return 'table_chart';
    
    return 'insert_drive_file';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}