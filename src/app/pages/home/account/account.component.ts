import { CurrencyPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
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
          <div>
            <h2>Receitas</h2>
            <select [(ngModel)]="gainsMonth" class="input" name="type" id="input">
              @for(month of months; track $index){
                <option [value]="$index">{{month}}</option>
              }
            </select>
          </div>
          <h1>{{gainsValue()| currency: account()?.currency}}</h1>
        </div>
        <div class="small-box losts">
          <div>
          <h2>Despesas</h2>
            <select [(ngModel)]="lostsMonth" class="input" name="type" id="input">
              @for(month of months; track $index){
                <option [value]="$index">{{month}}</option>
              }
            </select>
          </div>
          <h1>{{lostsValue() | currency: account()?.currency}}</h1>
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

    readonly months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    protected lostsMonth = signal<number>(new Date().getMonth());
    protected gainsMonth = signal<number>(new Date().getMonth());

    protected lostsMonthValue = computed(() => {
      return{
      year: 2025,
      month: this.lostsMonth(),
      accountId: this.account()?.id,
      }
    });

    protected gainsMonthValue = computed(() => {
      return{
      year: 2025,
      month: this.gainsMonth(),
      accountId: this.account()?.id,
      }
    });

    protected gainsValue = computed(() => {
      const gains = this.transactionService.getGainsTransactionsByYearMonth(this.gainsMonthValue()) || 0
      console.log(gains)
      return gains
    });
    protected lostsValue = computed(() => this.transactionService.getLostsTransactionsByYearMonth(this.lostsMonthValue()) || 0);

}