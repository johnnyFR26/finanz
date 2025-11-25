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
    movimentations: MovimentModel[] | [];
    controls?: {
        description: string;
        icon: string;
        type: type;
        compound: boolean;
    }
}

export type type = 'monthly' | 'daily';

export type CreateHoldingDto = Omit<HoldingModel, 'id' | 'createdAt' | 'updatedAt'>;

