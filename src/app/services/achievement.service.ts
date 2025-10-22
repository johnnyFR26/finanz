import { environment } from "../../environments/environment";
import { AccountService } from "./account.service";
import { AchievementModal } from "../models/achievement.model";
import { effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AchievementService {
    private urlApi = environment.urlApi
    private http = inject(HttpClient)
    private achievements = signal<AchievementModal[]>([])
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()
    constructor(){
        effect(() => {
            this.getAchievements()
        })
    }
    setAchievements(creditCards: AchievementModal[]){
        this.achievements.set(creditCards)
    }
    getAchievements(){/*
        this.http.get<AchievementModal[]>(`${this.urlApi}/achievements/account/${this.account()?.id}`).subscribe({
            next: (response) => {
                this.setAchievements(response)
            },
            error: (error) => {
                console.log(error)
            }
        })*/
        const achievements = [{
            name: 'Economizador I',
            description: 'Economize um total de R$100',
            goal: 100,
            current: 0,
        },
        {
            name: 'Economizador II',
            description: 'Economize um total de R$250',
            goal: 250,
            current: 0,
        },
        {
            name: 'Economizador III',
            description: 'Economize um total de R$500',
            goal: 500,
            current: 0,
        },
        {
            name: 'Economizador IV',
            description: 'Economize um total de R$1000',
            goal: 1000,
            current: 0,
        },
        {
            name: 'Economizador V',
            description: 'Economize um total de R$5000',
            goal: 5000,
            current: 0,
        },
        {
            name: 'Girando a economia',
            description: 'Criou sua primeira transação',
            goal: 1,
            current: 0,
        },
        {
            name: 'Planejador I',
            description: 'Criou seu primeiro planejamento',
            goal: 1,
            current: 0,
        },
        {
            name: 'Planejador II',
            description: 'Seguiu o planejamento por 3 meses seguidos',
            goal: 3,
            current: 0,
        },
        {
            name: 'Planejador III',
            description: 'Seguiu o planejamento por 6 meses seguidos',
            goal: 6,
            current: 0,
        },
        {
            name: 'Planejador IV',
            description: 'Seguiu o planejamento por 9 meses seguidos',
            goal: 9,
            current: 0,
        },
        {
            name: 'Planejador V',
            description: 'Seguiu o planejamento por 12 meses seguidos',
            goal: 12,
            current: 0,
        },
        {
            name: 'Organizador',
            description: 'Criou sua primeira categoria',
            goal: 1,
            current: 0,
        }]
        this.setAchievements(achievements)
    }

    getCurrentAchievements(){
        return this.achievements.asReadonly()
    }

}