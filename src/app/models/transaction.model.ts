import { CategoryModel } from "./category.model"
import { CreditCardModel } from "./credit-card.model"
interface AttachedFile {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  thumbnail?: string;
}
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
    files: AttachedFile[]
}