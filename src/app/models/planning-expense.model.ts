export interface PlanningExpense {
    id?: string;
    name: string;
    totalValue: number;
    installments: number;
    currentInstallment: number;
    monthlyValue: number;
    startDate: string;
    type: 'fixed' | 'installment' | 'variable';
    planningId?: string;
}
