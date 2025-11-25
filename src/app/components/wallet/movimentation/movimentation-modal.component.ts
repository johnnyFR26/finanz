import { Component, computed, inject, model, signal} from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { createMovimentModel, type } from '../../../models/moviment.model';
import { WalletsService } from '../../../services/wallets.service';
import { AccountService } from '../../../services/account.service';


@Component({
    selector: 'app-movimentation-modal',
    template: `
    <div class="content">
      <section class="formTitle">
        <p>{{ this.data.title }}</p>
        <h5>{{ this.data.name }}</h5>
      </section>

      <section>
        <label>Valor</label>
        <input class="input" type="number" [(ngModel)]="value" name="value" [ngModelOptions]="{standalone: true}"/>
      </section>

      <mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Cancelar</button>
        <button mat-button (click)="onSubmit()" cdkFocusInitial>Ok</button>
      </mat-dialog-actions>
    </div>
    `,
    styleUrls: ['./movimentation-modal.component.scss'],
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
export class MovimentationModalComponent{
    readonly dialogRef = inject(MatDialogRef<MovimentationModalComponent>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);
    readonly walletsService = inject(WalletsService);
    readonly accountService = inject(AccountService);
    readonly account = this.accountService.getCurrentAccount()
    
    readonly id = signal<string>(this.data.id);
    readonly type = signal<type>(this.data.type);
    protected value = signal<number>(0.00);
    
    protected formValue = computed(() => {
      return <createMovimentModel>{
        value: this.value(),
        type: this.type(),
        holdingId: this.id(),
        accountId: this.account()?.id,
      }
    })
  
    onNoClick(): void {
      this.dialogRef.close();
      console.table(this.formValue())
    }
    onSubmit(): void {
      console.table(this.formValue())
      this.walletsService.postMovimentRequest(this.formValue())
      this.dialogRef.close()
    }
}