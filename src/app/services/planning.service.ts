import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { PlanningModel } from "../models/planning.model";
import { PlanningCategory } from "../models/planning-category.model";

interface CreatePlanningRequest {
  month: string;
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
        this.http.get<PlanningModel[]>(`${this.urlApi}/planning`).subscribe({
            next: (response) => {
                this.plannings.set(response)
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