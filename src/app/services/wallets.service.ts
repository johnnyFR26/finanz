import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { CreateHoldingDto, HoldingModel } from "../models/holding.model";
import { AccountService } from "./account.service";
import { createMovimentModel, MovimentModel, type } from "../models/moviment.model";

interface HoldingsResponse {
  holdings: HoldingModel[];
}

@Injectable({
    providedIn: 'root'
})
export class WalletsService {
    private http = inject(HttpClient)
    private urlApi = environment.urlApi
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()
    private holdings = signal<HoldingModel[]>([])

    constructor(){
        effect(() => {
            this.getHoldingsRequest()
        })
    }

    postHoldingRequest(holding: CreateHoldingDto, value: number) {
        return this.http.post<HoldingModel>(`${this.urlApi}/holdings`, holding)
            .subscribe({
                next: (response) => {
                    console.log(response)
                    this.setHoldings([...this.holdings(), response])
                    let firstMoviment = {
                        accountId: this.account()?.id,
                        value: value,
                        holdingId: response.id,
                        type: <type>"input"
                    }
                    this.postMovimentRequest(firstMoviment)
                },
                error: (error) => {
                    console.error(error)
                }
            });
    }

    private getHoldingsRequest() {
        return this.http.get<HoldingsResponse>(`${this.urlApi}/holdings/account/${this.account()?.id}`)
            .subscribe((response: HoldingsResponse) => {
                this.holdings.set(response.holdings);
            });
    }

    postMovimentRequest(moviment: createMovimentModel) {
        return this.http.post<MovimentModel>(`${this.urlApi}/moviment`, moviment)
            .subscribe({
                next: (response) => {
                    console.log(response)
                    this.getHoldingsRequest()
                },
                error: (error) => {
                    console.error(error)
                }
            });
    }

    deleteHostingRequest(holdingId: string) {
        return this.http.delete<HoldingModel>(`${this.urlApi}/holdings/${holdingId}`)
            .subscribe({
                next: (response) => {
                    console.log(response)
                    this.setHoldings([...this.holdings(), response])
                },
                error: (error) => {
                    console.error(error)
                }
            });
    }

    setHoldings(holdings: HoldingModel[]) {
        this.holdings.set(holdings)
    }

    getHoldings() {
        return this.holdings.asReadonly()
    }
}