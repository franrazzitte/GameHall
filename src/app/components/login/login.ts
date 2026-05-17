import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private auth = inject(AuthService);
  email = '';
  password = '';
  loading = signal(false);
  errorOnSubmit = signal('');
  userExampleOne() {
    this.email = 'user1@example.com';
    this.password = '123456789'
  }
  userExampleTwo() {
    this.email = 'user2@example.com';
    this.password = '123456789'
  }
  userExampleThree() {
    this.email = 'user3@example.com';
    this.password = '123456789'
  }
  async onSubmit() {
    this.loading.set(true);
    const result = await this.auth.login(this.email, this.password);
    if(!result.success) {
      console.error(result.error)
      if (result.error === 'invalid_credentials') {
        this.errorOnSubmit.set('Correo o contraseña incorrectos');
      } else {
        this.errorOnSubmit.set('Ocurrió un error inesperado')
      }
    }
    this.loading.set(false);
  }
}