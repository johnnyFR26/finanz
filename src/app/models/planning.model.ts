import { PlanningCategory } from "./planning-category.model"
import { PlanningIncome } from "./planning-income.model"
import { PlanningExpense } from "./planning-expense.model"

export interface PlanningModel {
    id: string
    month: string
    limit: number
    availableLimit: number
    title?: string
    accountId: string
    categories?: PlanningCategory[]
    planningCategories: any[]
    incomes: PlanningIncome[]
    expenses: PlanningExpense[]
}
