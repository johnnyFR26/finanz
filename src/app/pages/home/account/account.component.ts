import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'app-account',
    template: `
        <h1>Conta: {{account()?.currentValue | currency: 'BRL'}}</h1>
        <br>
        <hr>
        <button mat-fab extended color="primary" (click)="openDialog()">
        <mat-icon>payment</mat-icon>
            Depositar
        </button>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe, MatIconModule, MatButtonModule]
})
export class AccountComponent implements OnInit{
    
    ngOnInit(): void {     
        console.table(this.account)
    }
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()
    readonly dialog = inject(MatDialog);
    public name = signal('Lucas');
    public animal = signal('Dog');

  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      data: {name: this.user()?.user.name, animal: this.animal()},
    });
}

}