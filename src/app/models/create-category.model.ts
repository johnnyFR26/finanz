import { TransactionModel } from "./transaction.model"

export interface CreateCategoryModel {
    name: string
    id?: string
    accountId?: string
    transactions?: TransactionModel[]
    controls?: string
}