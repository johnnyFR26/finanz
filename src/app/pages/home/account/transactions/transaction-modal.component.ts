import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div>
    <h2 mat-dialog-title>Enviar de {{data.name}}</h2>
    <mat-dialog-content>
      <p>Nova tranferencia</p>
      <mat-form-field>
      <mat-label>Para</mat-label>
      <input matInput [(ngModel)]="value" />
      </mat-form-field>
      <mat-form-field>
      <mat-label>Valor</mat-label>
      <input matInput [(ngModel)]="value" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Transferir</mat-label>
        <mat-select>
        <mat-option value="input">Entrada</mat-option>
        <mat-option value="output">Saida</mat-option>
      </mat-select>
        </mat-form-field>
        <mat-form-field>
        <mat-label>Descriçao</mat-label>
        <textarea matInput [(ngModel)]="value"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="animal()" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
    </div>
    `,
    styleUrls: ['./transaction-modal.component.scss'],
    imports: [    
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatSelectModule
      ]
})
export class TransactionModalComponent{
    readonly dialogRef = inject(MatDialogRef<TransactionModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly animal = model(this.data.animal);
    value = 0;
    protected valueSignal = signal('0');
  
    onNoClick(): void {
      this.dialogRef.close();
    }
}