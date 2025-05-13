import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'user-modal',
    template: `
    <div class="content">
      <p>Configurações</p>


      <p>Deseja excluir a conta?</p>

    <mat-dialog-actions>
      <button mat-button cancelar (click)="onNoClick()">Cancelar</button>
      <button class="excluir" mat-button excluir (click)="onSubmit()" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
    </div>
   
    `,
    styleUrls: ['./user-modal.component.scss'],
    imports: [MatDialogActions, FormsModule],
})
export class UserModalComponent {
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    readonly dialogRef = inject(MatDialogRef<UserModalComponent>)

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): any {
        this.userService.deleteUser()
        this.dialogRef.close()
    }

}
