import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class IaService {
    private http = inject(HttpClient)
    private urlApi = environment.urlApi
    

    sendMessage(message: string) {
       return this.http.post(`${this.urlApi}/ai-agent/chat`, {
            "message": message
        })
    }
}