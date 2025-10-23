import { CurrencyPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { TransactionModalComponent } from "./transactions/transaction-modal.component";
import { UserService } from "../../../services/user.service";
import { TransactionService } from "../../../services/transaction.service";
import { GraphsComponent } from "../../../components/graphs/graphs.component";
import { CreditCardService } from "../../../services/credit-card.service";
import { FormsModule } from "@angular/forms";

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
          <div>
            <h2>Cartão de crédito</h2>
            <select [(ngModel)]="currentCardLimit" class="input" name="type" id="input">
              @for(creditCard of creditCards(); track $index){
                <option [value]="creditCard.availableLimit">{{creditCard.name}}</option>
              }
            </select>
          </div>
          <h1>{{currentCardLimit() | currency: account()?.currency}}</h1>
        </div>
      </div>
      <div class="buttons">
        <button class="deposit" mat-fab (click)="openDialog('Depositar', 'input')">
        <mat-icon>add</mat-icon>
            Adicionar Receita
        </button>
        <button class="transfer" mat-fab (click)="openDialog('Transferir', 'output')">
        <mat-icon>add</mat-icon>
            Adicionar Despesa
        </button>
      </div>
      <app-graphs></app-graphs>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe, MatIconModule, MatButtonModule, GraphsComponent, FormsModule]
})
export class AccountComponent {
    
    protected transactionService = inject(TransactionService)
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()
    readonly dialog = inject(MatDialog);
    public id = this.account()?.id
    protected sum = this.transactionService.sum;
    protected sub = this.transactionService.sub;

    private creditCardService = inject(CreditCardService);
    protected creditCards = this.creditCardService.getCurrentCreditCard();
    protected currentCardLimit = signal(0.00)
    

  openDialog(title: string, type: string): void {
    this.dialog.open(TransactionModalComponent, {
      data: {
        name: this.user()?.user.name,
        id: this.id,
        title,
        type
    },
    });
}

}