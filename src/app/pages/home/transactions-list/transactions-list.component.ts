import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthSelectorComponent } from "../../../components/month-selector/month-selector.component";

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [TransactionComponent, MatIcon, CurrencyPipe, FormsModule, CommonModule, MonthSelectorComponent],
  template: `
  <select class="mini-box filter" [(ngModel)]="type" [ngClass]="{
    'all': type() === 'transaction',
    'revenue': type() === 'input',
    'expense': type() === 'output'
  }">
    <option class="all" value="transaction">Transações</option>
    <option class="revenue" value="input">Receitas</option>
    <option class="expense" value="output">Despesas</option>
  </select>
  <div class="box">
    <month-selector [ngClass]="{
    'all': type() === 'transaction',
    'revenue': type() === 'input',
    'expense': type() === 'output'
  }" (month)="changeMonth($event)"/>
    <div class="value gains">
      <h2 class="entrada">RECEITAS</h2>
      <h1>{{sum()| currency: account()?.currency}}</h1>
      <mat-icon>forward</mat-icon>
    </div>
    <div class="value losts">
      <h2 class="saida">DESPESAS</h2>
      <h1>{{sub() | currency: account()?.currency}}</h1>
      <mat-icon>forward</mat-icon>
    </div>
    <div class= "box transaction-list">
      @for (transaction of transactions(); track $index) {
        @if (type() !== 'transaction') {
          @if (transaction.type === type()) {
            <app-transaction
              [transaction]="transaction"
              [ngClass]="{
                'all': type() === 'transaction',
                'revenue': type() === 'input',
                'expense': type() === 'output'
              }"
            />
          }
        }
        @else {
            <app-transaction
              [transaction]="transaction"
            />
          }
      }
    </div>
  </div>
  
  `,
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  protected monthValue = computed(() => {
    return{
    year: 2025,
    month: this.month(),
    accountId: this.account()?.id,
    }
  });

  changeMonth(month:number){
    this.month.set(month + 1)
    this.transactionService.getAccountTransactionsByYearMonth(this.monthValue());
  }

  protected month = signal<number>(new Date().getMonth() + 1);
  protected account = this.accountService.getCurrentAccount();
  protected transactions = this.transactionService.getTransactions();
  protected transactionsByYearMonth = this.transactionService.getAccountTransactionsByYearMonth(this.monthValue());
  protected sum = this.transactionService.sum;
  protected sub = this.transactionService.sub;
  protected type = signal<string | null>('transaction');

}