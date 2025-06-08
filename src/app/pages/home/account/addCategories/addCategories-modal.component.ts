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
import { CategoryService } from '../../../../services/category.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div class="content">
      <p>Criar categoria</p>


      <label>Nome</label>
      <input class="input" [(ngModel)]="name" name="name" [ngModelOptions]="{standalone: true}" />

      <mat-label for="icon">Icone</mat-label>
      <mat-select name="icon" [(ngModel)]="icon">
        <mat-option value="account_balance"><mat-icon>account_balance</mat-icon></mat-option>
      </mat-select>

    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button (click)="onSubmit()" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
    </div>
    `,
    styleUrls: ['./addCategories-modal.component.scss'],
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
export class AddCategoriesModalComponent{
    readonly dialogRef = inject(MatDialogRef<AddCategoriesModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly id = model(this.data.id);
    private accountService = inject(AccountService)
    public account = this.accountService.getCurrentAccount()
    public name = signal('')
    public icon = signal('')


    private categoryService = inject(CategoryService)
    

    protected formValue = computed(() => {
      return {
        accountId: this.account()?.id,
        name: this.name()
      }
    })
  
    onNoClick(): void {
      this.dialogRef.close();
      console.table(this.formValue())
    }
    onSubmit(): any {
      console.table(this.formValue())
      this.categoryService.createCategory(this.formValue())
      this.dialogRef.close()
    }
}