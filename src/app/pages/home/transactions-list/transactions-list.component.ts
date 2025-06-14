import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, TransactionComponent],
  template: `
  <div class="box">
    <h1>Transações</h1>
  @for (transaction of transactions(); track $index) {
    <transaction
      [transaction]="transaction"
    />
  }
  </div>
  
  `,
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  protected account = this.accountService.getCurrentAccount();
  protected transactions = this.transactionService.getTransactions();
  protected displayedColumns: string[] = ['destination', 'value', 'type', 'createdAt'];

}