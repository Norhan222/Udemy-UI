import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service';
import { LoginResponse } from '../Models/login-response';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  avatar: string;
  time: string;
  id?: string;
}

export interface ChatAPIRequest {
  message: string;
  userId?: string;
  conversationId?: string;
}

export interface ChatAPIResponse {
  reply: string;
  conversationId?: string;
  suggestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = environment.apiUrl;
  private apiKey = 'YOUR_API_KEY'; // إذا كان يحتاج API Key

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$: Observable<boolean> = this.isTypingSubject.asObservable();

  private conversationId: string | null = null;
  private user!: any
  private userId: string

  constructor(private http: HttpClient, private auth: AuthService) {
    this.initializeWelcomeMessage();
    this.user = auth.user$
    this.userId = this.user.Id
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk", this.userId)
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  private initializeWelcomeMessage(): void {
    this.addMessage(
      'Welcome to Udemy! 👋\n\nI\'m here to help you with any questions about courses, certificates, or technical issues. How can I assist you today?',
      'bot'
    );
  }

  openChat(): void {
    this.isOpenSubject.next(true);
  }

  closeChat(): void {
    this.isOpenSubject.next(false);
  }

  toggleChat(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  addMessage(text: string, sender: 'user' | 'bot'): void {
    const avatar = sender === 'bot' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const id = Date.now().toString();

    const messages = [...this.messagesSubject.value]; // Create a copy
    messages.push({ text, sender, avatar, time, id });
    this.messagesSubject.next(messages);
  }

  // 🔥 إرسال رسالة للـ API
  sendMessage(message: string): Observable<string> {
    return new Observable(observer => {
      // إضافة رسالة المستخدم
      this.addMessage(message, 'user');

      // تفعيل مؤشر الكتابة
      this.isTypingSubject.next(true);

      const requestBody: ChatAPIRequest = {
        message: message,
        userId: this.userId,
        conversationId: this.conversationId || undefined
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}` // إذا كان يحتاج API Key
      });

      // إرسال الطلب للـ API
      this.http.post<ChatAPIResponse>(`${this.apiUrl}/chatt/message`, requestBody, { headers })
        .pipe(
          map(response => {
            // حفظ الـ conversation ID
            if (response.conversationId) {
              this.conversationId = response.conversationId;
            }
            return response.reply;
          }),
          catchError(error => {
            console.error('Chat API Error:', error);
            // رد افتراضي في حالة الخطأ
            return of('Sorry, I\'m having trouble connecting. Please try again later. 😔');
          })
        )
        .subscribe({
          next: (reply) => {
            // إيقاف مؤشر الكتابة
            this.isTypingSubject.next(false);

            // إضافة رد البوت
            this.addMessage(reply, 'bot');

            observer.next(reply);
            observer.complete();
          },
          error: (error) => {
            this.isTypingSubject.next(false);
            observer.error(error);
          }
        });
    });
  }

  // 🔥 إرسال رسالة مع ملف
  sendMessageWithFile(message: string, file: File): Observable<string> {
    return new Observable(observer => {
      this.addMessage(message, 'user');
      this.isTypingSubject.next(true);

      const formData = new FormData();
      formData.append('message', message);
      formData.append('file', file);
      formData.append('userId', this.userId);
      if (this.conversationId) {
        formData.append('conversationId', this.conversationId);
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.apiKey}`
      });

      this.http.post<ChatAPIResponse>(`${this.apiUrl}/upload`, formData, { headers })
        .pipe(
          map(response => response.reply),
          catchError(error => {
            console.error('Upload Error:', error);
            return of('Sorry, I couldn\'t process the file. Please try again. 😔');
          })
        )
        .subscribe({
          next: (reply) => {
            this.isTypingSubject.next(false);
            this.addMessage(reply, 'bot');
            observer.next(reply);
            observer.complete();
          },
          error: (error) => {
            this.isTypingSubject.next(false);
            observer.error(error);
          }
        });
    });
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.conversationId = null;
    this.initializeWelcomeMessage();
  }

  getMessages(): Message[] {
    return this.messagesSubject.value;
  }

  // 🔥 جلب سجل المحادثات من الـ API
  loadChatHistory(): Observable<Message[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.get<any>(`${this.apiUrl}/chatt/history/`, { headers })
      .pipe(
        map(response => {
          const messages: Message[] = response.messages.map((msg: any) => ({
            text: msg.text,
            sender: msg.sender,
            avatar: msg.sender === 'bot' ? '🤖' : '👤',
            time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            id: msg.id
          }));
          this.messagesSubject.next(messages);
          return messages;
        }),
        catchError(error => {
          console.error('Load History Error:', error);
          return of([]);
        })
      );
  }
}
