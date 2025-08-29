import {Component, computed, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


@Component({
    selector: 'app-addCategories-modal',
    template: `
    <div class="content">
      <p>Criar categoria</p>


      <label>Nome</label>
      <input class="input" [(ngModel)]="name" name="name" [ngModelOptions]="{standalone: true}" />

      <div class="divisao">
        <div>
          <mat-label for="icon" class="start">Icone</mat-label>
          <div class="select-icon start">
            <mat-select name="icon" [(ngModel)]="icon">
              @for (icon of icons; track $index) {
                <mat-option value="{{icon}}"><mat-icon>{{icon}}</mat-icon></mat-option>
              }
            </mat-select>
            <mat-icon class="icon" [style.color]="color()">{{icon()}}</mat-icon>
          </div>
        </div>

        <div>
          <mat-label for="color">Cor</mat-label>
          <div class="color-box">
            <div (click)="inputcolor.click()" [style.background-color]="color()" class="fake-color-picker"></div>
            <input name="color" type="color" [(ngModel)]="color" #inputcolor class="color-picker"/>
          </div>
        </div>
      </div>
      <mat-radio-group [(ngModel)]="type" name="type" class="radios start">
        <mat-radio-button value="income" class="income">Entrada</mat-radio-button>
        <mat-radio-button value="expenditure" class="expenditure">Saída</mat-radio-button>
      </mat-radio-group>

      <mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Cancelar</button>
        <button mat-button (click)="onSubmit()" cdkFocusInitial>Ok</button>
      </mat-dialog-actions>
    </div>
    `,
    styleUrls: ['./add-categories-modal.component.scss'],
    imports: [    
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogActions,
        MatSelectModule,
        MatIconModule,
        MatRadioModule,
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
    public icons = [
      'account_balance',
      'savings',
      'shopping_cart',
      'payment',
      'credit_card',
      'attach_money'
    ]
    public type = signal('');

    public color = signal('');



    private categoryService = inject(CategoryService)
    

    protected formValue = computed(() => {
      return {
        accountId: this.account()?.id,
        name: this.name(),
        controls: JSON.stringify({
          icon: this.icon(),
          color: this.color(),
          type: this.type(),
        })
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