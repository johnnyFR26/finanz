import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
    selector: 'user-modal',
    template: `
    <div class="content">
      <p>Configurações</p>
      <br>
      <a (click)="redirectToPath('/home/my-account')">Ver Conta <mat-icon>exit_to_app</mat-icon></a>
      <br>
      <br>
    </div>
   
    `,
    styleUrls: ['./user-modal.component.scss'],
    imports: [FormsModule, MatIconModule],
})
export class UserModalComponent {
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    readonly dialogRef = inject(MatDialogRef<UserModalComponent>)
    protected router = inject(Router)

    public redirectToPath(route: string){
      this.router.navigate([route])
      this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): any {
        this.userService.deleteUser()
        this.accountService.setCurrentAccount(null)
        this.dialogRef.close()
    }

}
