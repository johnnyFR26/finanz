import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
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
  incomes?: Array<{ name: string; value: number }>;
  expenses?: Array<{
    name: string;
    totalValue: number;
    installments: number;
    currentInstallment: number;
    startDate: string;
    type: string;
  }>;
}

interface PlanningsResponse {
  plannings: PlanningModel[];
  pagination: any;
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
            next: () => {
                this.getPlannings()
            },
            error: (error) => {
                console.error(error)
            }
        })
    }

    getPlannings() {
        this.http.get<PlanningsResponse>(`${this.urlApi}/planning/account/${this.account()?.id}`).subscribe({
            next: (response) => {
                this.setPlannings(response.plannings)
            },
            error: (error) => {
                console.error(error)
            }
        })
    }

    duplicatePlanning(planningId: string): Observable<any> {
        return this.http.post<any>(`${this.urlApi}/planning/${planningId}/duplicate`, {})
    }

    getProjection(planningId: string): Observable<any> {
        return this.http.get<any>(`${this.urlApi}/planning/${planningId}/projection`)
    }

    getPlanningsSignal() {
        return this.plannings.asReadonly()
    }

    setPlannings(plannings: PlanningModel[]) {
        this.plannings.set(plannings)
    }
}
