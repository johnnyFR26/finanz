import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";
import { AddCategoriesModalComponent } from "./addCategories/addCategories-modal.component";
import { CreditCardSelectComponent } from "../../../components/credit-card-select/credit-card-select.component";
import { TransactionService } from "../../../services/transaction.service";
import { GraphsComponent } from "../../../components/graphs/graphs.component";

@Component({
    selector: 'app-account',
    template: `
          <div class="box">
            <div class="currency">
              <h2>SALDO ATUAL</h2>
              <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
              <mat-icon>account_balance</mat-icon>
            </div>
            <div class="small-box gains">
              <h2>RECEITAS<mat-icon>forward</mat-icon></h2>
              <h1>{{sum()| currency: 'BRL'}}</h1>
            </div>
            <div class="small-box losts">
              <h2>DESPESAS<mat-icon>forward</mat-icon></h2>
              <h1>{{sub() | currency: 'BRL'}}</h1>
            </div>
          </div>
          <credit-card-select/>
          <div class="box">
            <div class="buttons">
              <button class="button deposit" mat-fab extended (click)="openDialog('Depositar', 'input')">
              <mat-icon>payment</mat-icon>
                  Entrada +
              </button>
              <button class="button transfer" mat-fab extended (click)="openDialog('Transferir', 'output')">
              <mat-icon>transfer_within_a_station</mat-icon>
                  Saída -
              </button>
              <button class="button add" mat-fab extended (click)="openCategoriesDialog()">
              <mat-icon>playlist_add</mat-icon>
                  Categoria
              </button>
            </div>
          </div>
          <app-graphs></app-graphs>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe, MatIconModule, MatButtonModule, CreditCardSelectComponent, GraphsComponent]
})
export class AccountComponent implements OnInit{
    
    ngOnInit(): void {     
        console.table(this.account)
        console.log(this.sum())
    }
    protected transactionService = inject(TransactionService)
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()
    readonly dialog = inject(MatDialog);
    public id = this.account()?.id
    protected sum = this.transactionService.sum;
    protected sub = this.transactionService.sub;


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