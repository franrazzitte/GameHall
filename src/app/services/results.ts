import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Results {
  supabase = inject(SupabaseService);

  constructor(public auth: AuthService) {}
  
  async saveResultGame(game: string, won: boolean | null, info: any) {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('results')
      .insert({
        user_id: this.auth.user()?.id,
        username: this.auth.username(),
        game,
        won,
        data: info
      });

    if (error) {
      console.error(error);
      return;
    }
    
    return data;
  }

  async getResults(game: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('results').select('*').eq('game', game);

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  }
}