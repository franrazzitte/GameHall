import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  githubUser = inject(GithubService);
  usuario = signal<any | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const user = await this.githubUser.getUser();
      this.usuario.set(user);
    } catch {
      this.error.set('Error al cargar usuario');
    } finally {
      this.loading.set(false);
    }
  }
}