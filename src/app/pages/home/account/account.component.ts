import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";
import { AddCategoriesModalComponent } from "./addCategories/addCategories-modal.component";

@Component({
    selector: 'app-account',
    template: `
        <h1>Conta: {{account()?.currentValue | currency: 'BRL'}}</h1>
        <br>
        <hr>
        <button class="deposit" mat-fab extended color="primary" (click)="openDialog('Depositar', 'input')">
        <mat-icon>payment</mat-icon>
            Depositar
        </button>
        <button class="transfer" mat-fab extended color="alert" (click)="openDialog('Transferir', 'output')">
        <mat-icon>transfer_within_a_station</mat-icon>
            Transferir
        </button>
        <button class="add" mat-fab extended color="info" (click)="openCategoriesDialog()">
        <mat-icon>playlist_add</mat-icon>
            Categoria
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
    public id = this.account()?.id

    openCategoriesDialog(): void {
        const dialogRef = this.dialog.open(AddCategoriesModalComponent, {
          data: {
            id: this.id,
        },
        });
    }

  openDialog(title: String, type: String): void {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      data: {
        name: this.user()?.user.name,
        id: this.id,
        title: title,
        type
    },
    });
}

}