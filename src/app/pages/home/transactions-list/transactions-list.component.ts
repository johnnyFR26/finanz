import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, CurrencyPipe, DatePipe, TransactionComponent],
  template: `
    <h1>Transações</h1>
  @for (transaction of transactions(); track $index) {
    <transaction
      [transaction]="transaction"
    />
  }
  
  `,
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  protected account = this.accountService.getCurrentAccount();
  protected transactions = signal<any>([]);
  protected displayedColumns: string[] = ['destination', 'value', 'type', 'createdAt'];

  ngOnInit(): void {
    this.transactionService.getAccountTransactions(this.account()!.id).subscribe((data) => {
      this.transactions.set(data);
    });
  }
}