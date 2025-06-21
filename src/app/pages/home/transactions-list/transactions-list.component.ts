import { Component, inject } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { TransactionComponent } from '../../../components/transaction/transaction.component';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [TransactionComponent],
  template: `
  <div class="box">
    <h1>Transações</h1>
    <div class= "box transaction-list">
      @for (transaction of transactions(); track $index) {
        <transaction
          [transaction]="transaction"
        />
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

}