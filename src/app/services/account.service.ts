import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CreateAccountModel } from "../models/create-account.model";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class AccountService{
    private http = inject(HttpClient)
    private userService = inject(UserService)
    private currentUser = this.userService.getUserInfo()
    private urlApi = environment.urlApi

    createAccount(account: CreateAccountModel){
        return this.http.post(`${this.urlApi}/accounts/${this.currentUser()?.user.email}`, account).subscribe({
            next: (response: any) => {
                console.log('Response:', response)
            },
            error: (error: any) => {
                console.log('Error:', error)
            }
        })
    }

}