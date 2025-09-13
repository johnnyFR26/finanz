import {ChangeDetectionStrategy, Component, computed, inject, model, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import { MatIconModule } from "@angular/material/icon";
import { AddCategoriesModalComponent } from '../../../../modals/add-categories/add-categories-modal.component';
import { CreditCardService } from '../../../../services/credit-card.service';


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div class="content">
      <p>{{ this.data.title }}</p>
      <label>Valor</label>
      <input class="input" type="number" [(ngModel)]="value" name="value" [ngModelOptions]="{standalone: true}"/>
      
      
        <label>Categorias</label>
        <div class="categories">
          <mat-select class="input" [(ngModel)]="categoryId" name="type">
            @for (category of categories(); track $index) {
              <mat-option [value]="category.id"><mat-icon [style.color]="category.controls?.color">{{category.controls?.icon}}</mat-icon> {{category.name}}</mat-option>
            }
          </mat-select>
          <button mat-icon-button (click)="openCategoriesDialog()"><mat-icon>add_box</mat-icon></button>
        </div>

        @if (type() == "output") {
          <label for="input">Cartão</label>
          <mat-select [(ngModel)]="creditCardId" class="input" name="type" id="input">
            @for(creditCard of creditCards(); track $index){
              <mat-option [value]="creditCard.id">{{creditCard.name}}</mat-option>
            }
          </mat-select>
        }

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
    MatSelectModule,
    MatIconModule
]
})
export class TransactionModalComponent{
    readonly dialogRef = inject(MatDialogRef<TransactionModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly id = model(this.data.id);
    private accountService = inject(AccountService)
    public account = this.accountService.getCurrentAccount()
    readonly dialog = inject(MatDialog);

    private categoryService = inject(CategoryService)
    protected categories = this.categoryService.getCurrentCategories()
    
    private creditCardService = inject(CreditCardService);
    protected creditCards = this.creditCardService.getCurrentCreditCard();
    protected creditCardId = signal(undefined);

    protected value = signal<number>(0.00);
    protected description = signal('');
    protected destination = signal('');
    protected type = signal(this.data.type);
    protected categoryId = signal<string | null>(null)
    private transactionService = inject(TransactionService)

    get formattedName(): string {
      return this.data.name?.split(' ').slice(0, 2).join(' ') ?? '';
    }
    

    protected formValue = computed(() => {
      return {
        value: this.value(),
        description: this.description(),
        destination: 'my wallet',
        type: this.type(),
        accountId: this.account()?.id,
        categoryId: this.categoryId(),
        creditCardId: this.creditCardId(),
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

    openCategoriesDialog(): void {
        const dialogRef = this.dialog.open(AddCategoriesModalComponent, {
          data: {
            id: this.account()?.id,
        },
        });
    }
}