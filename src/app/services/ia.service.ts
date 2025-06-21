import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class IaService {
    private http = inject(HttpClient)

    sendMessage(message: string) {
       return this.http.post('http://localhost:5678/webhook-test/464dc37b-87fd-4710-b549-948770b8e487', {
            "text": message
        })
    }
}