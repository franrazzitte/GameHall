import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Chat } from '../chat/chat';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-header',
  imports: [Chat],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  chatService = inject(ChatService);
  constructor(public auth: AuthService) {}
}