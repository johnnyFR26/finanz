import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root",
})
export class IaService {
    private http = inject(HttpClient)
    private userService = inject(UserService)
    private urlApi = environment.urlApi
    private user = this.userService.getUserInfo()
    

    sendMessage(message: string) {
       return this.http.post(`${this.urlApi}/ai-agent/chat${this.user()?.user.id}`, {
            "message": message
        })
    }
}