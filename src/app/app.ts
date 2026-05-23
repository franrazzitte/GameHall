import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Chat } from './components/chat/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Footer, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}