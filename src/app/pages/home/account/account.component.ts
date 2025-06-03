import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";
import { AddCategoriesModalComponent } from "./addCategories/addCategories-modal.component";
import { CreditCardComponent } from "../../../components/credit-card/credit-card.component";

@Component({
    selector: 'app-account',
    template: `
          <div class="box">
            <div class="currency">
              <h2>SALDO ATUAL</h2>
              <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
              <mat-icon>account_balance</mat-icon>
            </div>
            <div class="currency gains">
              <h2>RECEITAS<mat-icon>forward</mat-icon></h2>
              <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
            </div>
            <div class="currency losts">
              <h2>DESPESAS<mat-icon>forward</mat-icon></h2>
              <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
            </div>
          </div>
          <credit_card/>
          <div class="box">
            <div class="buttons">
              <button class="button deposit" mat-fab extended (click)="openDialog('Depositar', 'input')">
              <mat-icon>payment</mat-icon>
                  Depositar
              </button>
              <button class="button transfer" mat-fab extended (click)="openDialog('Transferir', 'output')">
              <mat-icon>transfer_within_a_station</mat-icon>
                  Transferir
              </button>
              <button class="button add" mat-fab extended (click)="openCategoriesDialog()">
              <mat-icon>playlist_add</mat-icon>
                  Categoria
              </button>
            </div>
          </div>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe, MatIconModule, MatButtonModule, CreditCardComponent]
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