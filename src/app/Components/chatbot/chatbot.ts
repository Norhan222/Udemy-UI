import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatbotService } from '../../Services/chatbot-service';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  isOpen = false;
  showOverlay = false;
  isTyping = false;
  messageInput = '';
  showNotification = true;
  notificationCount = 3;
  messages: Message[] = [];
  selectedFile: File | null = null;

  quickQuestions: QuickQuestion[] = [
    { label: '📚 Start Course', question: 'How do I start a new course?' },
    { label: '🏆 Get Certificate', question: 'How do I get a certificate?' },
    { label: '💳 Payment Help', question: 'Payment issue' },
    { label: '👨‍🏫 Contact Instructor', question: 'How to contact instructor?' }
  ];
  user$;

  constructor(private chatbotService: ChatbotService, private auth: AuthService, private cdr: ChangeDetectorRef) {
    this.user$ = auth.user$

  }

  ngOnInit(): void {
    // Subscribe to messages
    this.chatbotService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;

        this.cdr.detectChanges();

        setTimeout(() => this.scrollToBottom(), 100);
      });

    // Subscribe to open/close state
    this.chatbotService.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isOpen = isOpen;
        this.showOverlay = isOpen;

        // تحميل سجل المحادثات عند الفتح
        if (isOpen && this.messages.length <= 1) {
          this.loadHistory();
        }
      });

    // Subscribe to typing indicator
    this.chatbotService.isTyping$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isTyping => {
        this.isTyping = isTyping;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openChat(): void {
    this.chatbotService.openChat();
    this.showNotification = false;
  }

  closeChat(): void {
    this.chatbotService.closeChat();
  }

  sendQuickQuestion(question: string): void {
    this.messageInput = question;
    this.sendMessage();
  }

  sendMessage(): void {
    const message = this.messageInput.trim();
    if (!message) return;

    this.messageInput = '';

    if (this.selectedFile) {
      // إرسال رسالة مع ملف
      this.chatbotService.sendMessageWithFile(message, this.selectedFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Send error:', error);
            this.selectedFile = null;
          }
        });
    } else {
      // إرسال رسالة عادية
      this.chatbotService.sendMessage(message)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => {
            console.error('Send error:', error);
          }
        });
    }
  }

  // معالجة رفع الملفات
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // التحقق من نوع وحجم الملف
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

      if (file.size > maxSize) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only images and PDFs are allowed.');
        return;
      }

      this.selectedFile = file;
      this.messageInput = `📎 ${file.name}`;
    }
  }

  loadHistory(): void {
    this.chatbotService.loadChatHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Load history error:', error);
        }
      });
  }

  scrollToBottom(): void {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
interface Message {
  text: string;
  sender: 'user' | 'bot';
  avatar: string;
  time: string;
}

interface QuickQuestion {
  label: string;
  question: string;
}
