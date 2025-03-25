import { Component, inject } from "@angular/core";
import { TransactionService } from "../../../services/transaction.service";

@Component({
    selector: 'app-transactions-list',
    template: `
        <p>Table of transactions</p>
    `,
    styleUrls: ['./transaction-list.component.scss']
})
export class TransactionsListComponent {
    transactionService = inject(TransactionService)
    
}