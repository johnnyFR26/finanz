import { AfterViewInit, Component, inject, signal, ViewChild, ElementRef, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MarkdownModule } from "ngx-markdown";
import { UserService } from "../../../services/user.service";
import { IaService } from "../../../services/ia.service";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: "app-ia",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MarkdownModule
  ],
  templateUrl: "./ia.component.html",
  styleUrls: ["./ia.component.scss"]
})
export class IAComponent implements AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('inputArea') inputArea!: ElementRef;
  @ViewChild('initialMessageElement') initialMessageElement!: ElementRef;

  private userService = inject(UserService);
  private iaService = inject(IaService);

  protected user = this.userService.getUserInfo();
  protected currentMessage = '';
  protected messages = signal<Message[]>([]);
  protected isLoading = signal(false);
  protected showInitialMessage = signal(true);
  protected isTypingInitial = signal(true);

  private initialMessage = `Olá ${this.user()?.user?.name || 'usuário'}, como posso te ajudar hoje?`;

  protected canSend = computed(() => {
    return this.currentMessage.trim().length > 0 && !this.isLoading();
  });

  protected hasTypingMessage = computed(() => {
    return this.messages().some(m => m.isTyping);
  });

  ngAfterViewInit(): void {
    this.typeInitialMessage();
  }

  private typeInitialMessage(): void {
    const element = this.initialMessageElement?.nativeElement;
    if (!element) return;

    let index = 0;
    const type = () => {
      if (index < this.initialMessage.length) {
        element.innerHTML += this.initialMessage.charAt(index);
        index++;
        setTimeout(type, 50);
      } else {
        this.isTypingInitial.set(false);
      }
    };
    type();
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
      return;
    }
    keyboardEvent.preventDefault();
    this.sendMessage();
  }

  adjustTextareaHeight(): void {
    const textarea = this.inputArea?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }

  sendMessage(): void {
    if (!this.canSend()) return;

    const messageContent = this.currentMessage.trim();
    this.currentMessage = '';

    // Reset textarea height
    if (this.inputArea) {
      this.inputArea.nativeElement.style.height = 'auto';
    }

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: this.generateId(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.showInitialMessage.set(false);
    this.scrollToBottom();

    // Chamar API
    this.isLoading.set(true);

    this.iaService.sendMessage(messageContent).subscribe({
      next: (response) => {
        const assistantMessage: Message = {
          id: this.generateId(),
          //@ts-expect-error did not find the type
          content: response.message || response,
          role: 'assistant',
          timestamp: new Date()
        };

        this.messages.update(msgs => [...msgs, assistantMessage]);
        this.isLoading.set(false);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
        
        const errorMessage: Message = {
          id: this.generateId(),
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          role: 'assistant',
          timestamp: new Date()
        };

        this.messages.update(msgs => [...msgs, errorMessage]);
        this.isLoading.set(false);
        this.scrollToBottom();
      }
    });
  }

  clearChat(): void {
    if (confirm('Tem certeza que deseja limpar o histórico do chat?')) {
      this.messages.set([]);
      this.showInitialMessage.set(true);
      this.isTypingInitial.set(true);
      setTimeout(() => this.typeInitialMessage(), 100);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.chatContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}