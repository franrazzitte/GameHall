import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Game } from '../../models/models';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public auth: AuthService) {}
  games: Game[] = [
    {
      title: 'Ahorcado',
      image: 'img/ahorcado.png',
      link: '/games/ahorcado'
    },
    {
      title: 'Mayor o Menor',
      image: 'img/mayor-menor.png',
      link: '/games/mayor_o_menor'
    },
    {
      title: 'Preguntados',
      image: 'img/preguntados.png',
      link: '/games/preguntados'
    },
    {
      title: 'Wordle',
      image: 'img/wordle.png',
      link: '/games/wordle'
    }
  ]
}