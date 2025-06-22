import { Component, inject, computed, signal } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [TransactionComponent, MatIcon, CurrencyPipe, FormsModule, CommonModule],
  template: `
  <select class="mini-box" style="margin-bottom:30px;scale:1.2;" [(ngModel)]="type" [ngClass]="{
    'all': type() == 'transaction',
    'revenue': type() == 'input',
    'expense': type() == 'output'
  }">
    <option class="all" value="transaction">Transações</option>
    <option class="revenue" value="input">Receitas</option>
    <option class="expense" value="output">Despesas</option>
  </select>
  <div class="box">
    <div class="month-selector" [ngClass]="{
    'all': type() == 'transaction',
    'revenue': type() == 'input',
    'expense': type() == 'output'
  }">
      <button><mat-icon>keyboard_arrow_left</mat-icon></button>
      <div class="mini-box"><span>Junho</span></div>
      <button><mat-icon>keyboard_arrow_right</mat-icon></button>
    </div>
    <div class="small-box gains">
      <h2 class="entrada">RECEITAS</h2>
      <h1>{{sum()| currency: 'BRL'}}</h1>
      <mat-icon>forward</mat-icon>
    </div>
    <div class="small-box losts">
      <h2 class="saida">DESPESAS</h2>
      <h1>{{sub() | currency: 'BRL'}}</h1>
      <mat-icon>forward</mat-icon>
    </div>
    <div class= "box transaction-list">
      @for (transaction of transactions(); track $index) {
        @if (type() != 'transaction') {
          @if (transaction.type==type()) {
            <transaction
              [transaction]="transaction"
              [ngClass]="{
                'all': type() == 'transaction',
                'revenue': type() == 'input',
                'expense': type() == 'output'
              }"
            />
          }
        }
        @else {
            <transaction
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

  protected account = this.accountService.getCurrentAccount();
  protected transactions = this.transactionService.getTransactions();
  protected sum = this.transactionService.sum;
  protected sub = this.transactionService.sub;
  protected type = signal<string | null>('transaction');

}