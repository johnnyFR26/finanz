import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";
import { CreditCardSelectComponent } from "../../../components/credit-card-select/credit-card-select.component";
import { TransactionService } from "../../../services/transaction.service";
import { GraphsComponent } from "../../../components/graphs/graphs.component";

@Component({
    selector: 'app-account',
    template: `
      <div class="flex">
        <div class="small-box currency">
          <h2>Saldo Atual</h2>
          <h1>{{account()?.currentValue | currency: account()?.currency}}</h1>
        </div>
        <div class="small-box gains">
          <h2>Receitas</h2>
          <h1>{{sum()| currency: account()?.currency}}</h1>
        </div>
        <div class="small-box losts">
          <h2>Despesas</h2>
          <h1>{{sub() | currency: account()?.currency}}</h1>
        </div>
        <div class="small-box credit-card">
          <h2>Cartão de crédito</h2>
          <h1>{{sub() | currency: account()?.currency}}</h1>
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


    

  openDialog(title: String, type: String): void {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      data: {
        name: this.user()?.user.name,
        id: this.id,
        title,
        type
    },
    });
}

}