import { Injectable, signal, inject } from '@angular/core';
import { Message } from '../models/models';
import { SupabaseService } from './supabase';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private supabase = inject(SupabaseService);
  public message = signal<Message[]>([]);
  isChatOpen = signal(false);

  constructor(public auth: AuthService) {
    this.getMessages();
    this.getRealTimeMessages();
  }

  toggleChat() {
    if (this.isChatOpen()) this.isChatOpen.set(false);
    else this.isChatOpen.set(true);
  }

  async getMessages() {
    const client = this.supabase.getClient();

    const { data, error } = await client
      .from('chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error cargando mensajes:', error);
      return;
    }

    if (data) {
      this.message.set(data as Message[]);
    }
  }

  getRealTimeMessages() {
    const client = this.supabase.getClient();

    client
      .channel('chat-global')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat'
        },
        () => {
          this.getMessages();
        }
      )
      .subscribe();
  }

  async sendMessage(content: string) {
    const client = this.supabase.getClient();

    const {
      data: { user },
      error: authError
    } = await client.auth.getUser();

    if (authError || !user) {
      console.error('Usuario no autenticado:', authError);
      return;
    }

    const { error } = await client.from('chat').insert({
      user_id: user.id,
      username: this.auth.username(),
      content: content.trim()
    });

    if (error) {
      console.error('Error enviando mensaje:', error);
    }
  }
}