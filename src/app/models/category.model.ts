import { TransactionModel } from "./transaction.model"

export interface CategoryModel {
    name: string
    id?: string
    accountId?: string
    transactions?: TransactionModel[]
}