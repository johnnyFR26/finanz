import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HoldingModel } from "../models/holding.model";
import { AccountService } from "./account.service";

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
    private holdings = signal<HoldingModel[] | null>(null)

    contructor(){
        effect(() => {
            this.getHoldingsRequest()
        })
    }

     postHoldingRequest(holding: HoldingModel) {
        return this.http.post(`${this.urlApi}/holdings`, holding)
    }

    private getHoldingsRequest() {
        return this.http.get<HoldingsResponse>(`${this.urlApi}/holdings/account/${this.account()?.id}`)
            .subscribe((response: HoldingsResponse) => {
             this.holdings.set(response.holdings);
            });
    }

    setHoldings(holdings: HoldingModel[]) {
        this.holdings.set(holdings)
    }

    getHoldings() {
        return this.holdings.asReadonly()
    }
}