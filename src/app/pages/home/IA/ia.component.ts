import { 
  AfterViewInit, 
  Component, 
  inject, 
  signal, 
  ViewChild, 
  ElementRef, 
  computed, 
  OnInit,
  OnDestroy 
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MarkdownModule } from "ngx-markdown";
import { UserService } from "../../../services/user.service";
import { IaService } from "../../../services/ia.service";
import { Subject, takeUntil } from "rxjs";
import { ChatHistoryService } from "../../../services/chatHistory.service";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessageAt: Date;
  createdAt: Date;
  userId: number;
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
    MatMenuModule,
    MatTooltipModule,
    MarkdownModule
  ],
  templateUrl: "./ia.component.html",
  styleUrls: ["./ia.component.scss"]
})
export class IAComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('inputArea') inputArea!: ElementRef;
  @ViewChild('initialMessageElement') initialMessageElement!: ElementRef;

  private userService = inject(UserService);
  private iaService = inject(IaService);
  private chatHistoryService = inject(ChatHistoryService);
  private destroy$ = new Subject<void>();

  protected user = this.userService.getUserInfo();
  protected currentMessage = '';
  protected messages = signal<Message[]>([]);
  protected conversations = signal<Conversation[]>([]);
  protected isLoading = signal(false);
  protected showInitialMessage = signal(true);
  protected isTypingInitial = signal(true);
  protected showSidebar = signal(true);
  protected isLoadingConversations = signal(false);

  // ID da conversa atual
  protected currentConversationId = signal<string | null>(null);

  private initialMessage = `Olá ${this.user()?.user?.name || 'usuário'}, como posso te ajudar hoje?`;

  protected canSend = computed(() => {
    return  !this.isLoading();
  });

  protected hasTypingMessage = computed(() => {
    return this.messages().some(m => m.isTyping);
  });

  protected hasMessages = computed(() => {
    return this.messages().length > 0;
  });

  protected currentConversation = computed(() => {
    const convId = this.currentConversationId();
    if (!convId) return null;
    return this.conversations().find(c => c.id === convId) || null;
  });

  async ngOnInit(): Promise<void> {
    await this.loadConversations();
    await this.loadOrCreateConversation();
    this.subscribeToUpdates();
  }

  ngAfterViewInit(): void {
    if (this.showInitialMessage()) {
      this.typeInitialMessage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inscreve-se para atualizações de mensagens
   */
  private subscribeToUpdates(): void {
    this.chatHistoryService.messagesUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadConversations();
      });
  }

  /**
   * Carrega todas as conversas do usuário
   */
  private async loadConversations(): Promise<void> {
    const userId = this.user()?.user?.id;
    if (!userId) return;

    this.isLoadingConversations.set(true);
    try {
      const conversations = await this.chatHistoryService.getConversations(userId);
      this.conversations.set(conversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      this.isLoadingConversations.set(false);
    }
  }

  /**
   * Carrega a conversa mais recente ou cria uma nova
   */
  private async loadOrCreateConversation(): Promise<void> {
    const userId = this.user()?.user?.id;
    if (!userId) return;

    try {
      const conversations = this.conversations();
      
      if (conversations.length > 0) {
        // Carrega a conversa mais recente
        await this.selectConversation(conversations[0].id);
      } else {
        // Cria uma nova conversa
        await this.createNewConversation();
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      await this.createNewConversation();
    }
  }

  /**
   * Seleciona uma conversa específica
   */
  async selectConversation(conversationId: string): Promise<void> {
    if (this.currentConversationId() === conversationId) return;

    this.currentConversationId.set(conversationId);
    await this.loadConversationMessages();
  }

  /**
   * Carrega as mensagens da conversa atual do IndexedDB
   */
  private async loadConversationMessages(): Promise<void> {
    const conversationId = this.currentConversationId();
    if (!conversationId) return;

    try {
      const messages = await this.chatHistoryService.getMessages(conversationId);
      
      if (messages.length > 0) {
        this.messages.set(messages.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        this.showInitialMessage.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      } else {
        this.messages.set([]);
        this.showInitialMessage.set(true);
        this.isTypingInitial.set(true);
        setTimeout(() => this.typeInitialMessage(), 100);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  /**
   * Converte as mensagens para o formato da API (sem incluir a mensagem atual)
   */
  private buildChatHistory(): ChatHistoryMessage[] {
    const messages = this.messages();
    
    const validMessages = messages.filter(m => 
      m.role === 'user' || m.role === 'assistant'
    );

    // Pega as últimas 20 mensagens (excluindo a última que acabou de ser enviada)
    const recentMessages = validMessages.slice(-21, -1);

    return recentMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      content: msg.content
    }));
  }

  /**
   * Cria uma nova conversa
   */
  async createNewConversation(): Promise<void> {
    const userId = this.user()?.user?.id;
    if (!userId) return;

    try {
      const conversationId = await this.chatHistoryService.createConversation(
        userId,
        'Nova Conversa'
      );
      
      this.currentConversationId.set(conversationId);
      this.messages.set([]);
      this.showInitialMessage.set(true);
      this.isTypingInitial.set(true);
      
      await this.loadConversations();
      setTimeout(() => this.typeInitialMessage(), 100);
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error);
    }
  }

  /**
   * Atualiza o título da conversa com base na primeira mensagem
   */
  private async updateConversationTitle(conversationId: string, firstMessage: string): Promise<void> {
    try {
      // Gera um título a partir dos primeiros 50 caracteres da mensagem
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...'
        : firstMessage;
      
      await this.chatHistoryService.updateConversationTitle(conversationId, title);
      await this.loadConversations();
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  }

  /**
   * Deleta uma conversa
   */
  async deleteConversation(conversationId: string, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    if (!confirm('Tem certeza que deseja deletar esta conversa?')) {
      return;
    }

    try {
      await this.chatHistoryService.deleteConversation(conversationId);
      await this.loadConversations();

      // Se a conversa deletada era a atual, cria ou seleciona outra
      if (this.currentConversationId() === conversationId) {
        const conversations = this.conversations();
        if (conversations.length > 0) {
          await this.selectConversation(conversations[0].id);
        } else {
          await this.createNewConversation();
        }
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
    }
  }

  /**
   * Renomeia uma conversa
   */
  async renameConversation(conversationId: string, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    const conversation = this.conversations().find(c => c.id === conversationId);
    if (!conversation) return;

    const newTitle = prompt('Novo título da conversa:', conversation.title);
    if (!newTitle || newTitle.trim() === '') return;

    try {
      await this.chatHistoryService.updateConversationTitle(conversationId, newTitle.trim());
      await this.loadConversations();
    } catch (error) {
      console.error('Erro ao renomear conversa:', error);
    }
  }

  /**
   * Exporta uma conversa
   */
  async exportConversation(conversationId: string, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    try {
      const exportData = await this.chatHistoryService.exportConversation(conversationId);
      const conversation = this.conversations().find(c => c.id === conversationId);
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversa-${conversation?.title || 'sem-titulo'}-${Date.now()}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar conversa:', error);
    }
  }

  private typeInitialMessage(): void {
    const element = this.initialMessageElement?.nativeElement;
    if (!element) return;

    element.innerHTML = '';
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

  async sendMessage(): Promise<void> {
    const conversationId = this.currentConversationId();
    if (!this.canSend() || !conversationId) return;

    const messageContent = this.currentMessage.trim();
    const isFirstMessage = this.messages().length === 0;
    
    this.currentMessage = '';

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

    // Salva mensagem no IndexedDB
    try {
      await this.chatHistoryService.addMessage(
        conversationId,
        messageContent,
        'user'
      );

      // Se for a primeira mensagem, atualiza o título da conversa
      if (isFirstMessage) {
        await this.updateConversationTitle(conversationId, messageContent);
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }

    // Construir histórico (sem a mensagem atual)
    const history = this.buildChatHistory();

    // Chamar API
    this.isLoading.set(true);

    this.iaService.sendMessage(messageContent, history).subscribe({
      next: async (response) => {
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

        // Salva resposta no IndexedDB
        try {
          await this.chatHistoryService.addMessage(
            conversationId,
            assistantMessage.content,
            'assistant'
          );
        } catch (error) {
          console.error('Erro ao salvar resposta:', error);
        }
      },
      error: async (error) => {
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

  async clearChat(): Promise<void> {
    const conversationId = this.currentConversationId();
    if (!conversationId) return;

    if (!confirm('Tem certeza que deseja limpar o histórico desta conversa?')) {
      return;
    }

    try {
      await this.chatHistoryService.clearConversationMessages(conversationId);
      
      this.messages.set([]);
      this.showInitialMessage.set(true);
      this.isTypingInitial.set(true);
      setTimeout(() => this.typeInitialMessage(), 100);
    } catch (error) {
      console.error('Erro ao limpar chat:', error);
    }
  }

  toggleSidebar(): void {
    this.showSidebar.update(show => !show);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return messageDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
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