import { isUserLogged } from './../guards/is-user-logged.can-activate.guard';
import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { createUser } from "../models/user.model";
import { UserStorage } from "../models/user-storage.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient)
    private userInfo = signal<UserStorage | null>(null)
    private urlApi = environment.urlApi

    constructor(){
        effect(() => {
            this.syncUserInfoWithLocalStorage()
        })
    }

    createUser(user: createUser) {
        return this.http.post(`${this.urlApi}/users`, user)
    }

    loginUser(user: { email: string, password: string }) {
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