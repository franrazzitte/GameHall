import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private apiUrl = 'https://api.github.com/users/franrazzitte';
  private http = inject(HttpClient);

  async getUser() {
    const apiUser = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return {
      image: apiUser.avatar_url,
      name: apiUser.name,
      username: apiUser.login,
      bio: apiUser.bio,
      url: apiUser.html_url
    };
  }
}