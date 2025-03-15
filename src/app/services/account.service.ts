import { effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CreateAccountModel } from "../models/create-account.model";
import { UserService } from "./user.service";
import { AccountStorageModel } from "../models/account-storage.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService{
    private http = inject(HttpClient)
    private userService = inject(UserService)
    private currentUser = this.userService.getUserInfo()
    private urlApi = environment.urlApi
    private currentAccount = signal<CreateAccountModel | null>(this.loadAccountFromLocalStorage())

    constructor(){
        effect(()=> {
            this.syncAccountWithLocalStorage()
        })
    }

    createAccount(account: CreateAccountModel){
        return this.http.post(`${this.urlApi}/accounts/${this.currentUser()?.user.email}`, account).subscribe({
            next: (response: any) => {
                console.log('Response:', response)
                this.setCurrentAccount(response)
            },
            error: (error: any) => {
                console.log('Error:', error)
            }
        })
    }

    setCurrentAccount(account: AccountStorageModel | null){
        this.currentAccount.set(account)
    }

    getCurrentAccount(){
        return this.currentAccount.asReadonly()
    }

    syncAccountWithLocalStorage(){
        if(this.currentAccount()){
            localStorage.setItem('AccountData', JSON.stringify(this.currentAccount()))
        }else{
            localStorage.removeItem('AccountData')
        }
    }

    loadAccountFromLocalStorage(): AccountStorageModel | null {
        const storedAccount = localStorage.getItem('AccountData')
        return storedAccount ? JSON.parse(storedAccount) : null
    }

    isAccountCreated(){
        return !this.currentAccount()
    }

}