export interface AchievementModal {
    name: string;
    id?: string;
    //accountId: string;
    description: string;
    goal: number;
    current: number;
    controls?: any;
}