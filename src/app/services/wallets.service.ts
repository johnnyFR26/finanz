import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { CreateHoldingDto, HoldingModel } from "../models/holding.model";
import { AccountService } from "./account.service";
import { createMovimentModel, MovimentModel } from "../models/moviment.model";

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

    postHoldingRequest(holding: CreateHoldingDto) {
        console.log(holding.dueDate instanceof Date)
        return this.http.post<HoldingModel>(`${this.urlApi}/holdings`, holding)
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

    setHoldings(holdings: HoldingModel[]) {
        this.holdings.set(holdings)
    }

    getHoldings() {
        return this.holdings.asReadonly()
    }
}