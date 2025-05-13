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


@Component({
    selector: 'app-transaction-modal',
    template: `
    <div class="content">
      <h2>VOCÊ TEM CERTEZA?</h2>

    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button class="danger-button" mat-button (click)="onSubmit()" cdkFocusInitial>Deletar</button>
    </mat-dialog-actions>
    </div>
    `,
    styleUrls: ['./deleteAccount-modal.component.scss'],
    imports: [    
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogActions,
        MatSelectModule
      ]
})
export class DeleteAccountModalComponent{
    readonly dialogRef = inject(MatDialogRef<DeleteAccountModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly id = model(this.data.id);
    private accountService = inject(AccountService)
    public account = this.accountService.getCurrentAccount()


    

    protected formValue = computed(() => {
      return {
        accountId: this.account()?.id
      }
    })
  
    onNoClick(): void {
      this.dialogRef.close();
      console.table(this.formValue())
    }
    onSubmit(): any {
      console.table(this.formValue())
      this.accountService.deleteAccount()
      this.dialogRef.close()
    }
}