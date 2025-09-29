import { PlanningCategory } from "./planning-category.model"

export interface PlanningModel {
    id: string
    month: number
    day?: number
    year: number
    limit: number
    available: number
    title?: string
    accountId: string
    categories: PlanningCategory[]
}