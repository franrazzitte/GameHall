import { Component, OnInit, signal } from '@angular/core';
import { Keyboard } from '../../components/keyboard/keyboard';

type CellState = 'correct' | 'present' | 'incorrect';

@Component({
  selector: 'app-wordle',
  imports: [Keyboard],
  templateUrl: './wordle.html',
  styleUrl: './wordle.css',
})
export class Wordle implements OnInit {
  words = ['ARBOL','AVION','LUNAR','AUDIO','PERRO','GATOS','CASAS','PLAYA','NUBES','RATON','TENIS','SALTO','FRUTA','PIANO','RUEDA','CAMPO','BANCO','QUESO','TIGRE','LLAVE'];
  secretWord: string[] = [];
  lifesArray: number[] = [0, 1, 2, 3, 4];
  
  currentWord = signal<string[]>([]);
  attempts = signal<{ word: string[]; states: CellState[] }[]>([]);
  lifes = signal(5);
  gameOver = signal(false);
  won = signal(false);
  message = signal('');
  
  letterCondition = new Map<string, 'green' | 'yellow' | 'gray'>();

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    this.secretWord = [...this.words[randomIndex]];
    
    this.currentWord.set([]);
    this.attempts.set([]);
    this.gameOver.set(false);
    this.won.set(false);
    this.message.set('');
    this.letterCondition.clear();
  }

  onLetterPressed(letter: string) {
    if (this.gameOver()) return;

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
    
    if (currentWordStr.length !== 5) {
      this.message.set('La palabra debe tener 5 letras');
      return;
    }

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
      this.won.set(true);
      this.gameOver.set(true);
      this.message.set('¡Ganaste!');
      return;
    }

    if (this.lifes() < 1) {
      this.gameOver.set(true);
      this.message.set(`Perdiste. La palabra era: ${this.secretWord.join('')}`);
      return;
    }

    this.lifes.update(v => v - 1);
    this.lifesArray = Array.from({ length: this.lifes() }, (_, i) => i);
    console.log(this.lifesArray)
    this.currentWord.set([]);
  }

  private updateKeyboardColor(letter: string, color: 'green' | 'yellow' | 'gray') {
    const currentColor = this.letterCondition.get(letter);
    
    if (currentColor === 'green') return;
    if (currentColor === 'yellow' && color === 'gray') return;

    this.letterCondition.set(letter, color);
  }
}