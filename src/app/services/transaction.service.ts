import { computed, inject, Injectable, signal } from "@angular/core";
import { CreateTransactionModel } from "../models/create-transaction.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { TransactionModel } from "../models/transaction.model";
import { CreateTransactionByYearmonthModel } from "../models/create-transaction-by-yearmonth.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private urlApi = environment.urlApi;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private transactions = signal<TransactionModel[]>([]);
  public inputTransactions = computed(() => 
    this.transactions().filter(t => t.type === 'input')
  );
  public outputTransactions = computed(() => 
    this.transactions().filter(t => t.type === 'output')
  );

  createTransaction(transaction: CreateTransactionModel) {
    return this.http.post(`${this.urlApi}/transactions`, transaction)
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.setTransactions([response.transaction])
          this.accountService.setCurrentAccount({
            currentValue: response.accountUpdate.currentValue,
            currency: response.accountUpdate.currency,
            id: response.accountUpdate.id
          });
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
  }

  getAccountTransactions(accountId: string) {
    return this.http.get(`${this.urlApi}/transactions/account/${accountId}`).subscribe((response: any) => {
      this.setTransactions(response.transactions);
    });
  }

  getAccountTransactionsByYearMonth(yearmonth: CreateTransactionByYearmonthModel) {
    return this.http.post(`${this.urlApi}/transactions/by-yearmonth`, yearmonth)
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.transactions.set(response.transactions);
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
  }
  
    public sum = computed(() =>
    this.inputTransactions().reduce((acc, t) => acc + parseFloat(t.value), 0)
    );

    public sub = computed(() =>
    this.outputTransactions().reduce((acc, t) => acc + parseFloat(t.value), 0)
    );

  setTransactions(transactions: TransactionModel[]) {
    this.transactions.set(this.transactions().concat(transactions));
  }

  getTransactions() {
    return this.transactions.asReadonly();
  }
  
  getTransactionsByYearMonth(yearmonth: CreateTransactionByYearmonthModel) {
    return this.http.post(`${this.urlApi}/transactions/by-yearmonth`, yearmonth)
  }

  editTransaction(transaction: any) {

  }
}
