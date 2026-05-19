import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {
  username = '';
  lastname = '';
  email =  '';
  password = '';
  onSubmit():void{
    console.log(`Signup: `, this.username, this.email, this.password);
  }
}