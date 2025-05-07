import { computed, inject, Injectable, input, signal } from "@angular/core";
import { CreateTransactionModel } from "../models/create-transaction.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { TransactionModel } from "../models/transaction.model";

@Injectable({
    providedIn: 'root'
})
export class TransactionService{
    private urlApi = environment.urlApi
    private http = inject(HttpClient)
    private accountService = inject(AccountService)
    private transactions = signal<TransactionModel[]>([])


    createTransaction(transaction: CreateTransactionModel){
        return this.http.post(`${this.urlApi}/transactions`, transaction)
        .subscribe({
            next: (response: any) => {
                console.log('Response:', response)
                this.accountService.setCurrentAccount({
                    currentValue: response.accountUpdate.currentValue,
                    currency: response.accountUpdate.currency,
                    id: response.accountUpdate.id
                })
            },
            error: (error: any) => {
                console.error('Error:', error)
            }
        })
    }
    getAccountTransactions(accountId: string) {
        return this.http.get(`${this.urlApi}/transactions/${accountId}`);
      }

    sumAccountDeposits() {

        const sumTransactions = this.transactions()
            .filter(transaction => transaction.type == 'input')
            .reduce((sum, number) => sum + parseFloat(number.value), 0);
            
        const subTransactions = this.transactions()
            .filter(transaction => transaction.type == 'output')
            .reduce((sum, number) => sum + parseFloat(number.value), 0);

        const totalTransactions = computed(() => {
            return {
                sum: sumTransactions,
                sub: subTransactions
            }
        })
        return totalTransactions()
    }
      
    setTransactions(transactions: any){
        this.transactions.set(transactions)
    }

    getTransactions(){
        return this.transactions.asReadonly()
    }
}