import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MonthSelectorComponent } from '../../../components/month-selector/month-selector.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    TransactionComponent, MatIcon, CurrencyPipe, FormsModule,
    CommonModule, MonthSelectorComponent, MatButtonToggleModule,
  ],
  template: `
    <div class="extrato">
      <h2 class="page-title"><mat-icon>receipt_long</mat-icon> Extrato</h2>

      <month-selector (month)="changeMonth($event)" />

      <!-- Summary Cards -->
      <div class="summary-row">
        <div class="summary-card income">
          <mat-icon>arrow_downward</mat-icon>
          <div>
            <span class="summary-label">Receitas</span>
            <span class="summary-value">{{ sum() | currency: account()?.currency }}</span>
          </div>
        </div>
        <div class="summary-card expense">
          <mat-icon>arrow_upward</mat-icon>
          <div>
            <span class="summary-label">Despesas</span>
            <span class="summary-value">{{ sub() | currency: account()?.currency }}</span>
          </div>
        </div>
        <div class="summary-card balance" [class.positive]="balance() >= 0" [class.negative]="balance() < 0">
          <mat-icon>{{ balance() >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          <div>
            <span class="summary-label">Balanço</span>
            <span class="summary-value">{{ balance() | currency: account()?.currency }}</span>
          </div>
        </div>
      </div>

      <!-- Filter Toggle -->
      <mat-button-toggle-group [value]="type()" (change)="type.set($event.value)" class="filter-group" aria-label="Filtrar transações">
        <mat-button-toggle value="transaction">
          <mat-icon>list</mat-icon> Todas
        </mat-button-toggle>
        <mat-button-toggle value="input">
          <mat-icon>arrow_downward</mat-icon> Receitas
        </mat-button-toggle>
        <mat-button-toggle value="output">
          <mat-icon>arrow_upward</mat-icon> Despesas
        </mat-button-toggle>
      </mat-button-toggle-group>

      <!-- Transaction count -->
      <span class="tx-count">{{ filteredTransactions().length }} transações</span>

      <!-- Transaction List -->
      <div class="transaction-list">
        @for (transaction of filteredTransactions(); track transaction.id) {
          <app-transaction [transaction]="transaction" />
        } @empty {
          <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <p>Nenhuma transação encontrada</p>
            <p class="hint">Adicione receitas ou despesas na tela Home</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  protected month = signal<number>(new Date().getMonth() + 1);
  protected account = this.accountService.getCurrentAccount();
  protected transactions = this.transactionService.getTransactions();
  protected sum = this.transactionService.sum;
  protected sub = this.transactionService.sub;
  protected type = signal<string>('transaction');

  protected balance = computed(() => this.sum() - this.sub());

  protected filteredTransactions = computed(() => {
    const all = this.transactions();
    const filter = this.type();
    if (filter === 'transaction') return all;
    return all.filter(t => t.type === filter);
  });

  protected monthValue = computed(() => ({
    year: new Date().getFullYear(),
    month: this.month(),
    accountId: this.account()?.id,
  }));

  constructor() {
    this.transactionService.getAccountTransactionsByYearMonth(this.monthValue());
  }

  changeMonth(month: number) {
    this.month.set(month + 1);
    this.transactionService.getAccountTransactionsByYearMonth(this.monthValue());
  }
}
