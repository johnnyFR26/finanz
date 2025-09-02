import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CreditCardModel } from "../models/credit-card.model";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root'
})
export class CreditCardService {
    private urlApi = environment.urlApi
    private http = inject(HttpClient)
    private creditCards = signal<CreditCardModel[]>([])
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()
    constructor(){
        effect(() => {
            this.getCreditCards()
        })
    }
    setCreditCards(creditCards: CreditCardModel[]){
        this.creditCards.set(creditCards)
    }
    getCreditCards(){
        this.http.get<CreditCardModel[]>(`${this.urlApi}/creditcards/account/${this.account()?.id}`).subscribe({
            next: (response) => {
                this.setCreditCards(response)
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    createCreditCard(creditCard: CreditCardModel){
        this.http.post(`${this.urlApi}/creditcards`, creditCard).subscribe({
            next: (response) => {
                console.log(response)
                //@ts-expect-error
                this.setCreditCards([...this.creditCards(), response])
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    getCurrentCreditCard(){
        return this.creditCards.asReadonly()
    }


}