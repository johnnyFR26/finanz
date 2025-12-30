export interface MovimentModel{
    id: string
    value: number
    holdingId: string
    type: type
    createdAt: Date
    updatedAt: Date
}

export type type = 'input' | 'output'

export type createMovimentModel = Omit<MovimentModel, 'id' | 'createdAt' | 'updatedAt'>