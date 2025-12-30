export interface CreditCardModel {
    name: string;
    id?: string;
    accountId: string;
    invoiceId?: string;
    availableLimit: number;
    limit: number;
    company: string;
    expire: Date;
    close: Date;
    controls?: Record<string, object>;
    createdAt?: Date;
    updatedAt?: Date;
}