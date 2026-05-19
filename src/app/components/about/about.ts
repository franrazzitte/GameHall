import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface GitHubUser {
  image: string;
  name: string;
  username: string;
  bio: string;
  url: string;
}

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})

export class About implements OnInit {
  private apiUrl = 'https://api.github.com/users/franrazzitte';
  
  usuario = signal<GitHubUser | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (apiUser) => {
        const transformed: GitHubUser = {
          image: apiUser.avatar_url,
          name: apiUser.name,
          username: apiUser.login,
          bio: apiUser.bio,
          url: apiUser.html_url
        };
        
        this.usuario.set(transformed);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar usuario');
        this.loading.set(false);
      }
    });
  }
}