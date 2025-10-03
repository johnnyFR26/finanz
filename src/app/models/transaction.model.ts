import { CategoryModel } from "./category.model"
import { CreditCardModel } from "./credit-card.model"

export interface TransactionModel {
    id: string
    value: string
    description: string
    destination: string
    type: string
    createdAt: Date
    updatedAt: Date
    accountId: string
    categoryId: string
    creditCardId?: string
    controls?: Record<string, object>
    category: CategoryModel
    creditCard?: CreditCardModel
}