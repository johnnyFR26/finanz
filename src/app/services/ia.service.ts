import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

// Interface para o histórico de mensagens
interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

// Interface para a resposta da API
interface ChatResponse {
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class IaService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private urlApi = environment.urlApi;
  private user = this.userService.getUserInfo();

  sendMessage(
    message: string, 
    history: ChatHistoryMessage[] = []
  ): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `${this.urlApi}/ai-agent/chat/${this.user()?.user.id}`, 
      {
        message: message,
        history: history
      }
    );
  }
}