import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, CurrencyPipe, DatePipe, MatIconModule],
  template: `
    <div class="box">
      <div class="currency">
        <h2>SALDO ATUAL</h2>
        <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
        <mat-icon>account_balance</mat-icon>
      </div>
      <div class="box gains"></div>
      <div class="box losts"></div>
    </div>
  `,
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  protected account = this.accountService.getCurrentAccount();
  protected transactions = signal<any>([]);
  protected displayedColumns: string[] = ['destination', 'value', 'type', 'createdAt'];
  constructor(){
    effect(() => {
      this.transactionService.sumAccountDeposits()
    })
  }

  ngOnInit(): void {
    this.transactionService.getAccountTransactions(this.account()!.id).subscribe((data) => {
      this.transactions.set(data);
      this.transactionService.setTransactions(data)
    });
  }
}
