import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, CurrencyPipe, DatePipe],
  template: `
    <h1>Transações</h1>

    <table mat-table [dataSource]="transactions()" class="mat-elevation-z8" style="width: 100%;">

      <!-- ID Column -->
      <ng-container matColumnDef="destination">
        <th mat-header-cell *matHeaderCellDef> Destino </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.destination}} </td>
      </ng-container>

      <!-- Value Column -->
      <ng-container matColumnDef="value">
        <th mat-header-cell *matHeaderCellDef> Valor </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.value | currency:'BRL'}} </td>
      </ng-container>

      <!-- Type Column -->
      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef> Tipo </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.type}} </td>
      </ng-container>

      <!-- CreatedAt Column -->
      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef> Criado em </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.createdAt | date:'short'}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
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