import {ChangeDetectionStrategy, Component, computed, inject, model, signal} from '@angular/core';
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
import { AccountService } from '../../../../services/account.service';
import { TransactionService } from '../../../../services/transaction.service';


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div>
    <h2 mat-dialog-title>Enviar de {{data.name}}</h2>
    <mat-dialog-content>
      <p>Nova tranferencia</p>

      <mat-form-field>
      <mat-label>De</mat-label>
      <input matInput [(ngModel)]="destination" name="destination" [ngModelOptions]="{standalone: true}" />
      </mat-form-field>
      <mat-form-field>
      <mat-label>Valor</mat-label>
      <input matInput type="number" [(ngModel)]="value" name="value" [ngModelOptions]="{standalone: true}"/>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Transferir</mat-label>
        <mat-select matSelect name="type">
        <mat-option value="input">Entrada</mat-option>
        <mat-option value="output">Saida</mat-option>
      </mat-select>
        </mat-form-field>
        <mat-form-field>
        <mat-label>Descriçao</mat-label>
        <textarea matInput [(ngModel)]="description" name="description" [ngModelOptions]="{standalone: true}"></textarea>
      </mat-form-field>

    </mat-dialog-content> 
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button (click)="onSubmit()" cdkFocusInitial>Ok</button>
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
        MatSelectModule
      ]
})
export class TransactionModalComponent{
    readonly dialogRef = inject(MatDialogRef<TransactionModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly id = model(this.data.id);
    private accountService = inject(AccountService)
    public account = this.accountService.getCurrentAccount()

    protected value = signal<number>(0.00);
    protected description = signal('');
    protected destination = signal('');
    protected type = signal('input');
    private transactionService = inject(TransactionService)

    protected formValue = computed(() => {
      return {
        value: this.value(),
        description: this.description(),
        destination: this.destination(),
        type: this.type(),
        accountId: this.account()?.id
      }
    })
  
    onNoClick(): void {
      this.dialogRef.close();
      console.table(this.formValue())
    }
    onSubmit(): any {
      console.table(this.formValue())
      this.transactionService.createTransaction(this.formValue())
      this.dialogRef.close()


    }
}