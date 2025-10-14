import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  conversationId: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessageAt: Date;
  createdAt: Date;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  private dbName = 'finanz-chat-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  
  // Observable para notificar mudanças no histórico
  private messagesUpdated$ = new BehaviorSubject<void>(undefined);

  constructor() {
    this.initDB();
  }

  /**
   * Inicializa o IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Object Store para mensagens
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
          messagesStore.createIndex('conversationId', 'conversationId', { unique: false });
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Object Store para conversas
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationsStore.createIndex('userId', 'userId', { unique: false });
          conversationsStore.createIndex('lastMessageAt', 'lastMessageAt', { unique: false });
        }
      };
    });
  }

  /**
   * Garante que o DB está inicializado
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  /**
   * Cria uma nova conversa
   */
  async createConversation(userId: number, title = 'Nova Conversa'): Promise<string> {
    const db = await this.ensureDB();
    const conversationId = this.generateId();
    
    const conversation: Conversation = {
      id: conversationId,
      title,
      lastMessageAt: new Date(),
      createdAt: new Date(),
      userId
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const request = store.add(conversation);

      request.onsuccess = () => resolve(conversationId);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Adiciona uma mensagem ao histórico
   */
  async addMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant' | 'system'
  ): Promise<ChatMessage> {
    const db = await this.ensureDB();
    
    const message: ChatMessage = {
      id: this.generateId(),
      content,
      role,
      timestamp: new Date(),
      conversationId
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages', 'conversations'], 'readwrite');
      const messagesStore = transaction.objectStore('messages');
      const conversationsStore = transaction.objectStore('conversations');

      // Adiciona a mensagem
      const addRequest = messagesStore.add(message);

      addRequest.onsuccess = () => {
        // Atualiza o timestamp da conversa
        const getConvRequest = conversationsStore.get(conversationId);
        
        getConvRequest.onsuccess = () => {
          const conversation = getConvRequest.result;
          if (conversation) {
            conversation.lastMessageAt = new Date();
            conversationsStore.put(conversation);
          }
        };

        this.messagesUpdated$.next();
        resolve(message);
      };

      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  /**
   * Busca todas as mensagens de uma conversa
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const request = index.getAll(conversationId);

      request.onsuccess = () => {
        const messages = request.result.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        resolve(messages);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Busca mensagens de uma conversa (Observable)
   */
  getMessages$(conversationId: string): Observable<ChatMessage[]> {
    return from(this.getMessages(conversationId));
  }

  /**
   * Busca as últimas N mensagens de uma conversa
   */
  async getRecentMessages(conversationId: string, limit = 20): Promise<ChatMessage[]> {
    const messages = await this.getMessages(conversationId);
    return messages.slice(-limit);
  }

  /**
   * Busca todas as conversas de um usuário
   */
  async getConversations(userId: number): Promise<Conversation[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const conversations = request.result.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
        resolve(conversations);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Busca conversas de um usuário (Observable)
   */
  getConversations$(userId: number): Observable<Conversation[]> {
    return from(this.getConversations(userId));
  }

  /**
   * Busca uma conversa específica
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const request = store.get(conversationId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Atualiza o título de uma conversa
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const getRequest = store.get(conversationId);

      getRequest.onsuccess = () => {
        const conversation = getRequest.result;
        if (conversation) {
          conversation.title = title;
          const putRequest = store.put(conversation);
          
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Conversa não encontrada'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Deleta uma conversa e todas as suas mensagens
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages', 'conversations'], 'readwrite');
      const messagesStore = transaction.objectStore('messages');
      const conversationsStore = transaction.objectStore('conversations');
      const index = messagesStore.index('conversationId');

      // Deleta todas as mensagens da conversa
      const messagesRequest = index.openCursor(conversationId);
      
      messagesRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          // Após deletar mensagens, deleta a conversa
          const deleteConvRequest = conversationsStore.delete(conversationId);
          
          deleteConvRequest.onsuccess = () => {
            this.messagesUpdated$.next();
            resolve();
          };
          deleteConvRequest.onerror = () => reject(deleteConvRequest.error);
        }
      };

      messagesRequest.onerror = () => reject(messagesRequest.error);
    });
  }

  /**
   * Deleta uma mensagem específica
   */
  async deleteMessage(messageId: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const request = store.delete(messageId);

      request.onsuccess = () => {
        this.messagesUpdated$.next();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Limpa todas as mensagens de uma conversa
   */
  async clearConversationMessages(conversationId: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const index = store.index('conversationId');
      const request = index.openCursor(conversationId);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          this.messagesUpdated$.next();
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Exporta todas as mensagens de uma conversa (para backup)
   */
  async exportConversation(conversationId: string): Promise<string> {
    const conversation = await this.getConversation(conversationId);
    const messages = await this.getMessages(conversationId);

    const exportData = {
      conversation,
      messages,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Conta o total de mensagens em uma conversa
   */
  async getMessageCount(conversationId: string): Promise<number> {
    const messages = await this.getMessages(conversationId);
    return messages.length;
  }

  /**
   * Observable para detectar mudanças no histórico
   */
  get messagesUpdated(): Observable<void> {
    return this.messagesUpdated$.asObservable();
  }

  /**
   * Gera um ID único
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpa todo o banco de dados (use com cuidado!)
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages', 'conversations'], 'readwrite');
      
       transaction.objectStore('messages').clear();
      transaction.objectStore('conversations').clear();

      transaction.oncomplete = () => {
        this.messagesUpdated$.next();
        resolve();
      };
      
      transaction.onerror = () => reject(transaction.error);
    });
  }
}