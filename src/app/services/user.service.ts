import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { createUser } from "../models/user.model";
import { UserStorage } from "../models/user-storage.model";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient)
    private router = inject(Router)
    private userInfo = signal<UserStorage | null>(null)
    private urlApi = environment.urlApi

    constructor(){
        effect(() => {
            this.syncUserInfoWithLocalStorage()
        })
    }

    createUser(user: createUser) {
        return this.http.post(`${this.urlApi}/users`, user).subscribe((response: any) => {
            console.log('Response:', response)

            if(!response){
                return console.log("DEU MERDA", response)
            }

            this.router.navigateByUrl('/login')
        })
    }

    // new function to do after
    createUserObserVable(user: createUser){
        return this.http.post(`${this.urlApi}/users`, user).subscribe({
            next: (response: any) => {
                console.log('Response:', response)
            },
            error: (error: any) => {
                console.log('Error:', error)
            }
        })
    }

    loginUser(user: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.urlApi}/auth/login`, user)
    }

    syncUserInfoWithLocalStorage() {
        localStorage.setItem('UserData', JSON.stringify(this.userInfo()))
    }

    setCurrentUser(user: UserStorage) {
        this.userInfo.set(user)
    }

    getUserInfo() {
        return this.userInfo.asReadonly()
    }

    isUserLogged() {
        return !!this.userInfo()
    }

}