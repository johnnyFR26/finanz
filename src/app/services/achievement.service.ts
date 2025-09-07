import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { AchievementModal } from "../models/achievement.model";

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
            description: 'Economize um total de ',
            goal: 100,
            current: 100,
        },
        {
            name: 'Economizador II',
            description: 'Economize um total de ',
            goal: 500,
            current: 100,
        },
        {
            name: 'Economizador III',
            description: 'Economize um total de ',
            goal: 1000,
            current: 100,
        },
        {
            name: 'Economizador IV',
            description: 'Economize um total de ',
            goal: 2000,
            current: 100,
        },
        {
            name: 'Economizador V',
            description: 'Economize um total de ',
            goal: 5000,
            current: 100,
        },
        {
            name: 'Economizador VI',
            description: 'Economize um total de ',
            goal: 10000,
            current: 100,
        }]
        this.setAchievements(achievements)
    }

    getCurrentAchievements(){
        return this.achievements.asReadonly()
    }

}