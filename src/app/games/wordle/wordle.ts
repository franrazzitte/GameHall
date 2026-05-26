import { Component, inject, signal } from '@angular/core';
import { Keyboard } from '../../components/keyboard/keyboard';
import { Router } from "@angular/router";
import { Results } from '../../services/results';

type CellState = 'correct' | 'present' | 'incorrect';

@Component({
  selector: 'app-wordle',
  imports: [Keyboard],
  templateUrl: './wordle.html',
  styleUrl: './wordle.css',
})
export class Wordle {
  private router = inject(Router);
  private results = inject(Results);

  words = ['ARBOL','AVION','LUNAR','AUDIO','PERRO','GATOS','CASAS','PLAYA','NUBES','RATON','TENIS','SALTO','FRUTA','PIANO','RUEDA','CAMPO','BANCO','QUESO','TIGRE','LLAVE'];
  secretWord: string[] = [];
  lifesArray: number[] = [0, 1, 2, 3, 4];
  
  currentWord = signal<string[]>([]);
  attempts = signal<{ word: string[]; states: CellState[] }[]>([]);
  lifes = signal(5);
  gameOver = signal(false);
  won = signal(false);
  messageTitle = signal('');
  message = signal('');
  showMenu = signal(true);
  
  letterCondition = new Map<string, 'green' | 'yellow' | 'gray'>();

  quit() {
    this.router.navigate(['/']);
  }
  startGame() {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    this.secretWord = [...this.words[randomIndex]];
    
    this.showMenu.set(false);
    this.currentWord.set([]);
    this.attempts.set([]);
    this.gameOver.set(false);
    this.won.set(false);
    this.lifes.set(5);
    this.lifesArray = [0, 1, 2, 3, 4];
    this.messageTitle.set('');
    this.message.set('');
    this.letterCondition.clear();
  }

  onLetterPressed(letter: string) {
    if (this.gameOver()) {
      this.startGame();
      return
    }

    if (letter === 'bi-check2') {
      this.submitWord();
    } else if (letter === 'bi-backspace-fill') {
      this.currentWord.update(word => word.slice(0, -1));
    } else if (this.currentWord().length < 5) {
      this.currentWord.update(word => [...word, letter]);
    }
  }

  submitWord() {
    const currentWordStr = this.currentWord().join('');
    
    if (currentWordStr.length !== 5) return;

    const states: CellState[] = ['incorrect', 'incorrect', 'incorrect', 'incorrect', 'incorrect'];
    
    const secretLetters = [...this.secretWord];

    for (let i = 0; i < 5; i++) {
      if (this.currentWord()[i] === this.secretWord[i]) {
        states[i] = 'correct';
        this.updateKeyboardColor(this.currentWord()[i], 'green');
        secretLetters[i] = '';
      }
    }
    
    for (let i = 0; i < 5; i++) {
      if (states[i] === 'correct') continue;

      const letter = this.currentWord()[i];

      if (secretLetters.includes(letter)) {
        states[i] = 'present';
        this.updateKeyboardColor(letter, 'yellow');
        secretLetters[i+1] = '';
      } else {
        states[i] = 'incorrect';
        this.updateKeyboardColor(letter, 'gray');
      }
    }

    this.attempts.update(prev => [...prev, { word: this.currentWord(), states }]);

    if (currentWordStr === this.secretWord.join('')) {
      const modalWordleBtn = document.getElementById('modalWordleBtn');
      modalWordleBtn?.click();

      let finalScore = 0;

      if (this.lifes() === 5) finalScore = 18;
      else if (this.lifes() === 4) finalScore = 10;
      else finalScore = this.lifes() + 1;

      this.won.set(true);
      this.gameOver.set(true);
      this.messageTitle.set('¡Ganaste!');
      this.message.set(this.secretWord.join(''));
      this.sendToDB(true, finalScore);
      return;
    }

    if (this.lifes() < 1) {
      const modalWordleBtn = document.getElementById('modalWordleBtn');
      modalWordleBtn?.click();
      this.gameOver.set(true);
      this.lifes.set(-1);
      this.messageTitle.set('¡Perdiste!');
      this.message.set(this.secretWord.join(''));
      this.sendToDB(true, 0);
      return;
    }
    
    this.lifes.update(v => v - 1);
    this.lifesArray = Array.from({ length: this.lifes() }, (_, i) => i);
    this.currentWord.set([]);
  }

  async sendToDB(won: boolean, score: number) {
    await this.results.saveResultGame('Wordle', won, {
      score: score,
      word: this.secretWord.join(''),
      attempts: this.attempts()
    })
  }

  private updateKeyboardColor(letter: string, color: 'green' | 'yellow' | 'gray') {
    const currentColor = this.letterCondition.get(letter);
    
    if (currentColor === 'green') return;
    if (currentColor === 'yellow' && color === 'gray') return;

    this.letterCondition.set(letter, color);
  }
}