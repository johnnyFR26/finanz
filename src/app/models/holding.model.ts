import { MovimentModel } from "./moviment.model";

export interface HoldingModel {
    id: string;
    accountId: string;
    name: string;
    total: number;
    tax: number;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    movimentations: MovimentModel[];
    controls?: Record<string, object>;
}
