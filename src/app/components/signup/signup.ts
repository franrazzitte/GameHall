import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  private auth = inject(AuthService);
  username = '';
  lastname = '';
  email =  '';
  password = '';
  age = '';
  loading = signal(false);
  errorOnSubmit = signal('');
  async onSubmit() {
    const modalSignupBtn = document.getElementById('modalSignupBtn');
    const modalSignupLabel = document.getElementById('modalSignupLabel');
    const modalSignupBody = document.getElementById('modalSignupBody');
    this.loading.set(true);
    const result = await this.auth.signup(
        this.email,
        this.password,
        this.username,
        this.lastname,
        Number(this.age)
    );
    if(!result.success){
      if(modalSignupLabel) {
        modalSignupLabel.textContent = 'Error al crear cuenta';
      }
      if (result.error === 'user_already_exists') {
        if(modalSignupBody) {
          modalSignupBody.textContent = 'El correo electrónico ingresado ya está registrado. Por favor, inténtalo de nuevo con otro correo.';
        }
        this.errorOnSubmit.set('Este correo electrónico ya está registrado');
      } else {
        if(modalSignupBody) {
          modalSignupBody.textContent = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
        }
        this.errorOnSubmit.set('Ocurrió un error inesperado');
      }
      modalSignupBtn?.click()
      console.error(result.error);
    }
    this.loading.set(false);
  }
}