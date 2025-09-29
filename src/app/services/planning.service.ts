import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { PlanningModel } from "../models/planning.model";
import { PlanningCategory } from "../models/planning-category.model";
import { AccountService } from "./account.service";

interface CreatePlanningRequest {
  month: Date;
  day?: number;
  year: number;
  limit: number;
  availableLimit: number;
  title?: string;
  accountId: string;
  categories: PlanningCategory[];
}
@Injectable({
    providedIn: "root",
})
export class PlanningService {
    private http = inject(HttpClient)
    private urlApi = environment.urlApi
    private plannings = signal<PlanningModel[]>([])
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()

    constructor() {
        effect(() => {
            this.getPlannings()
        })
    }

    createPlanning(planning: CreatePlanningRequest) {
        return this.http.post(`${this.urlApi}/planning`, planning).subscribe({
            next: (response) => {
                console.log(response)
            },
            error: (error) => {
                console.error(error)
            }
        })
    }

    getPlannings() {
        this.http.get<PlanningModel[]>(`${this.urlApi}/planning/account/${this.account()?.id}`).subscribe({
            next: (response) => {
                /*@ts-ignore */
                this.setPlannings(response.plannings)
            },
            error: (error) => {
                console.error(error)
            }
        })
    }

    getPlanningsSignal() {
        return this.plannings.asReadonly()
    }

    setPlannings(plannings: PlanningModel[]) {
        this.plannings.set(plannings)
    }
}