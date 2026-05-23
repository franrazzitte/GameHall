import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  constructor(public auth: AuthService) {}
  chatService = inject(ChatService);
  newMessage = '';
  loading = signal(false);

  formatTime(date: string): string {
    const messageDate = new Date(date);
    const today = new Date();
    const sameDay = messageDate.toDateString() === today.toDateString();

    if (sameDay) return messageDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return messageDate.toLocaleDateString([], {day: '2-digit', month: '2-digit'}) + ' ' + messageDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }

  async send() {
    this.loading.set(true);
    const text = this.newMessage.trim();
    if (text) {
      await this.chatService.sendMessage(text);
      this.newMessage = '';
    }
    this.loading.set(false);
  }
}
