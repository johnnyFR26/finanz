import { Component, computed, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../services/account.service';
import { TransactionService } from '../../../../services/transaction.service';
import { CategoryService } from '../../../../services/category.service';
import { CreditCardService } from '../../../../services/credit-card.service';
import { AddCategoriesModalComponent } from '../../../../modals/add-categories/add-categories-modal.component';

@Component({
  selector: 'app-transaction-modal',
  template: `
    <div class="modal-container" [class]="type()">
      <div class="modal-header">
        <mat-icon>{{ type() === 'input' ? 'arrow_downward' : 'arrow_upward' }}</mat-icon>
        <h2>{{ data.title }}</h2>
      </div>

      <div class="modal-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor</mat-label>
          <input matInput type="number" [(ngModel)]="value" placeholder="0.00">
          <span matTextPrefix>R$&nbsp;</span>
          <mat-icon matSuffix>attach_money</mat-icon>
        </mat-form-field>

        <div class="category-row">
          <mat-form-field appearance="outline" class="category-field">
            <mat-label>Categoria</mat-label>
            <mat-select [(ngModel)]="categoryId">
              @for (category of categories(); track category.id) {
                <mat-option [value]="category.id">
                  @if (category.controls?.icon) {
                    <mat-icon [style.color]="category.controls?.color">{{ category.controls?.icon }}</mat-icon>
                  }
                  {{ category.name }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button mat-icon-button class="add-category-btn" (click)="openCategoriesDialog()" aria-label="Adicionar categoria">
            <mat-icon>add_circle</mat-icon>
          </button>
        </div>

        @if (type() === 'output') {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cartão de Crédito</mat-label>
            <mat-select [(ngModel)]="creditCardId">
              <mat-option [value]="undefined">Nenhum (débito)</mat-option>
              @for (card of creditCards(); track card.id) {
                <mat-option [value]="card.id">
                  <mat-icon>credit_card</mat-icon> {{ card.name }}
                </mat-option>
              }
            </mat-select>
            <mat-icon matPrefix>credit_card</mat-icon>
          </mat-form-field>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput [(ngModel)]="description" rows="3" placeholder="Detalhes da transação (opcional)"></textarea>
          <mat-icon matPrefix>notes</mat-icon>
        </mat-form-field>
      </div>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onNoClick()">Cancelar</button>
        <button mat-raised-button [color]="type() === 'input' ? 'primary' : 'warn'"
          (click)="onSubmit()" [disabled]="!isValid()">
          <mat-icon>{{ type() === 'input' ? 'add' : 'remove' }}</mat-icon>
          {{ type() === 'input' ? 'Adicionar Receita' : 'Adicionar Despesa' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrls: ['./transaction-modal.component.scss'],
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule,
    MatButtonModule, MatDialogActions, MatSelectModule, MatIconModule,
  ],
})
export class TransactionModalComponent {
  readonly dialogRef = inject(MatDialogRef<TransactionModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);
  readonly dialog = inject(MatDialog);

  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private creditCardService = inject(CreditCardService);

  public account = this.accountService.getCurrentAccount();
  protected categories = this.categoryService.getCurrentCategories();
  protected creditCards = this.creditCardService.getCurrentCreditCard();

  protected value = signal<number>(0);
  protected description = signal('');
  protected type = signal(this.data.type);
  protected categoryId = signal<string | null>(null);
  protected creditCardId = signal(undefined);

  protected isValid = computed(() =>
    this.value() > 0 && this.categoryId() !== null
  );

  protected formValue = computed(() => ({
    value: this.value(),
    description: this.description(),
    destination: 'my wallet',
    type: this.type(),
    accountId: this.account()?.id,
    categoryId: this.categoryId(),
    creditCardId: this.creditCardId(),
  }));

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.isValid()) {
      this.transactionService.createTransaction(this.formValue());
      this.dialogRef.close();
    }
  }

  openCategoriesDialog(): void {
    this.dialog.open(AddCategoriesModalComponent, {
      data: { id: this.account()?.id },
    });
  }
}
