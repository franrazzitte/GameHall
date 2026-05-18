import { Component } from '@angular/core';
import { Keyboard } from '../../components/keyboard/keyboard';

@Component({
  selector: 'app-ahorcado',
  imports: [Keyboard],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})

export class Ahorcado {
  isPlaying = false;
  lifes = 7;
  letterCondition = new Map<string, string>();
  word = new Array<string>();
  usedLetters = new Array<string>();

  onLetterPressed(letter: string) {
    console.log('Tecla presionada:', letter);
    if (letter === 'bi-check2') {
      this.isPlaying = true;
      this.letterCondition.set('bi-check2', 'd-none');
      this.letterCondition.set('bi-backspace-fill', 'd-none');
    } else if (letter === 'bi-backspace-fill') {
      this.word.pop();
    } else {
      if (!this.isPlaying) this.word.push(letter);
      else {
        this.letterCondition.set(letter, 'disabled');
        this.usedLetters.push(letter);
        if (!this.word.includes(letter)) this.lifes -= 1;
        if (this.lifes <= 0) {
          this.isPlaying = false;
          this.letterCondition.set('all', 'inactive');
        }
      }
    }
  }
}