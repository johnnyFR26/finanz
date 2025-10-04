import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { TransactionModel } from '../../models/transaction.model';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionModalComponent } from '../../modals/edit-transactions/edit-transaction-modal.component';
import { FileUploadModalComponent } from '../../modals/attach-file-modal/attach-file-modal.component';
import { FileUploadService } from '../../services/fileUpload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageViewerModalComponent } from '../attachedFile/image-viewer.component';
import { AttachmentGalleryComponent } from "../attachedFile/attachedFile.component";
import { UserService } from '../../services/user.service';

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
    selector: 'app-transaction',
    imports: [MatIconModule, MatButtonModule, MatExpansionModule, DatePipe, CurrencyPipe, AttachmentGalleryComponent],
    styleUrl: './transaction.component.scss',
    template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <button mat-fab-button (click)="switchSelect()">
            <mat-icon style="color: var(--type);">
              @if(buttonSelected()){check_circle}
              @else {radio_button_unchecked}
            </mat-icon>
          </button>
        </mat-panel-title>
        <mat-panel-description>
          <div>
          <span class="date">{{transaction()!.createdAt | date: "dd/MM/yyyy"}}</span>
          <h1 [class]="transaction()!.type === 'output' ? 'saida' : 'entrada'">{{transaction().value | currency: account()?.currency}}</h1>
          </div>
          {{transaction().category.name}} 
          @if (transaction().category.controls?.icon) {
            <mat-icon class="category-icon" [style.background-color]="transaction().category.controls?.color">{{transaction().category.controls?.icon}}</mat-icon>
          }
        </mat-panel-description>
      </mat-expansion-panel-header>
      @if(transaction().creditCard){
        <p>Cartão: {{transaction().creditCard?.name}}</p>
      }
      <p>{{transaction().description}}</p>
      <app-attachment-gallery
       [files]="attachedFiles"
       (addAttachment)="openUploadModal()"
        (fileClick)="viewFile($event)"
       (fileDownload)="downloadFile($event)"
       (fileDelete)="deleteFile($event)">
    </app-attachment-gallery>
        <div class="tools">
          <button (click)="openUploadModal()" mat-icon-button aria-label="anexar">
            <mat-icon class="file">attach_file</mat-icon>
          </button>
        <button mat-icon-button aria-label="editar" (click)="openEditTransactionModal(this.transaction())">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button aria-label="deletar">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
    </mat-expansion-panel>
    `
})

export class TransactionComponent{
  readonly panelOpenState = signal(false);
  readonly transaction = input.required<TransactionModel>();
  readonly buttonSelected = signal(true);
  private accountService = inject(AccountService);
  private uploadService = inject(FileUploadService)
  private userService = inject(UserService)
  private user = this.userService.getUserInfo()
  readonly dialog = inject(MatDialog);
  readonly account = this.accountService.getCurrentAccount()
    private snackBar = inject(MatSnackBar);
    attachedFiles: AttachedFile[] = [
    {
      id: '1',
      name: 'documento.pdf',
      url: 'https://example.com/file.pdf',
      type: 'application/pdf',
      size: 2048000,
      uploadedAt: new Date()
    },
    {
      id: '2',
      name: 'imagem.jpg',
      url: 'https://picsum.photos/400/300',
      type: 'image/jpeg',
      size: 1024000,
      uploadedAt: new Date()
    }
  ];

    uploadedFile: any = null;

  switchSelect() : void {
    if(this.buttonSelected() == true){
      this.buttonSelected.set(false);
    }
    else {
      this.buttonSelected.set(true)
    }
  };

      openUploadModal(): void {
    const dialogRef = this.dialog.open(FileUploadModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadService.uploadFile(result.file, {
          userId: String(this.user()!.user.id),
          transactionId: this.transaction().id
        }).subscribe({
          next: (progress) => {
            if (progress.state === 'uploading') {
              console.log(`Upload: ${progress.progress}%`);
            } else if (progress.state === 'done') {
              console.log('Upload completo!', progress.response);
              this.snackBar.open('Arquivo enviado!', 'Fechar', {
                duration: 3000
              });
            }
          },
          error: (error) => {
            console.error('Erro:', error);
            this.snackBar.open('Erro no upload', 'Fechar', {
              duration: 5000
            });
          }
        });
      }
    });
  }

  private handleFileUpload(fileData: any): void {
    this.uploadedFile = {
      name: fileData.file.name,
      size: this.formatFileSize(fileData.file.size)
    };

    // Exemplo 1: Enviar como FormData (recomendado)
    //this.sendAsFormData(fileData);

    // Exemplo 2: Enviar como Base64
    // this.sendAsBase64(fileData);

    // Exemplo 3: Enviar como ArrayBuffer
    // this.sendAsArrayBuffer(fileData);
  }
  openEditTransactionModal(transaction: TransactionModel) : void{
     this.dialog.open(EditTransactionModalComponent, {
          data: {
            transaction: transaction,
        },
        });
  }
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  viewFile(file: AttachedFile): void {
    console.log("2", file);
    this.dialog.open(ImageViewerModalComponent, {
      data: file,
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-viewer-dialog'
    });
  }

  downloadFile(file: AttachedFile): void {
    window.open(file.url, '_blank');
  }

  deleteFile(file: AttachedFile): void {
    if (confirm(`Deseja remover ${file.name}?`)) {
      // Lógica de delete
    }
}
}