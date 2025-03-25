import { Component, inject, OnInit, signal } from "@angular/core";
import { TransactionService } from "../../../services/transaction.service";
import { AccountService } from "../../../services/account.service";
import {MatTableModule} from '@angular/material/table';


@Component({
    selector: 'app-transactions-list',
    template: `
        <h1>Transações</h1>

      <table mat-table>

      </table>
    `,
    styleUrls: ['./transaction-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
    private transactionService = inject(TransactionService)
    private accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol']
    protected transactions = this.transactionService.getTransactions()
    ngOnInit(): void {
        this.transactionService.getAccountTransactions(this.account()!.id)
        console.log('estou no componente', this.transactions())
    }

}