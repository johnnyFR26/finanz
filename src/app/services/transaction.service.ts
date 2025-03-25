import { inject, Injectable, signal } from "@angular/core";
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

    getAccountTransactions(accountId: string){
        return this.http.get(`${this.urlApi}/transactions/${accountId}`)
        .subscribe({
            next: (response: any) => {
                console.table(response)
                this.setTransactions(response)
            },
            error: (error: any) => {
                console.error('Error:', error)
            }
        })
    }

    setTransactions(transactions: TransactionModel[]){
        this.transactions.set(transactions)
    }

    getTransactions(){
        return this.transactions.asReadonly()
    }
}