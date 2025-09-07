export interface CreditCardModel {
    name: string;
    id?: string;
    accountId: string;
    description: string;
    goal: number;
    current: number;
    controls?: any;
}