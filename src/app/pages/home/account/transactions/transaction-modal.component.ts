import {ChangeDetectionStrategy, Component, computed, inject, model, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { AccountService } from '../../../../services/account.service';
import { TransactionService } from '../../../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div class="content">
    <h2>{{formattedName}}</h2>
      <p>{{ this.data.title }}</p>


      <label>De</label>
      <input class="input" [(ngModel)]="destination" name="destination" [ngModelOptions]="{standalone: true}" />

      <label>Valor</label>
      <input class="input" type="number" [(ngModel)]="value" name="value" [ngModelOptions]="{standalone: true}"/>
      
      
        <label>Transferir</label>
        <select class="input" [(ngModel)]="type" name="type">
          <option value="input">Entrada</option>
          <option value="output">Saida</option>
        </select>
        
        
        <label>Descriçao</label>
        <textarea class="input" [(ngModel)]="description" name="description" [ngModelOptions]="{standalone: true}"></textarea>
      

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

    private categoryService = inject(CategoryService)
    protected categories = this.categoryService.getCurrentCategories()

    protected value = signal<number>(0.00);
    protected description = signal('');
    protected destination = signal('');
    protected type = signal('output');
    private transactionService = inject(TransactionService)

    get formattedName(): string {
      return this.data.name?.split(' ').slice(0, 2).join(' ') ?? '';
    }
    

    protected formValue = computed(() => {
      return {
        value: this.value(),
        description: this.description(),
        destination: this.destination(),
        type: this.type(),
        accountId: this.account()?.id,
        categoryId: "7b199e69-0862-4854-9678-a587d59560f6"
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