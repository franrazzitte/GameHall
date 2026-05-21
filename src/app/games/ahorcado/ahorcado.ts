import { Component, inject, signal } from '@angular/core';
import { Router } from "@angular/router";
import { Keyboard } from '../../components/keyboard/keyboard';
import { Results } from '../../services/results';

@Component({
  selector: 'app-ahorcado',
  imports: [Keyboard],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})

export class Ahorcado {
  private router = inject(Router);
  private results = inject(Results)

  letterCondition = new Map<string, string>();
  word = new Array<string>();
  usedLetters = new Array<string>();

  singleplayerEasyMode = ["sol","mar","pan","luz","flor","mesa","casa","perro","gato","libro","nube","campo","silla","rata","kiwi"];
  singleplayerHardMode = ["montaña","ventana","caminar","elefante","escritor","cuaderno","jirafa","pantalla","programa","lapicera","hospital","bicicleta","desayuno","aventura","animales"];

  isPlaying = signal(false);
  showMenu = signal(true);
  lifes = signal(7);
  mode = signal('');
  showInstruccions = signal(false);
  textInstruccions = signal('');
  showGameOption = signal(false);
  titleGameOptions = signal('');
  btn1GameOptions = signal('');
  btn2GameOptions = signal('');
  showKeyboard = signal(true);

  idTime = 0;
  time = signal(0);
  finalTime = signal(0);

  // Menu options
  singleplayerMode() {
    this.mode.set('singleplayer');
    this.textInstruccions.set('Elegiremos una palabra al azar para que puedas adivinar. Selecciona una de las dos dificultades para comenzar el juego.');
    this.showInstruccions.set(true);
    this.titleGameOptions.set('Dificultad');
    this.btn1GameOptions.set('Fácil');
    this.btn2GameOptions.set('Difícil');
    this.showGameOption.set(true);
    this.showKeyboard.set(false);
    this.showMenu.set(false);
  }
  multiplayerMode() {
    this.mode.set('multiplayer');
    this.textInstruccions.set('Escribe la palabra que quieras que adivine tu amigo, luego presiona el botón ✓ para que empiece el juego.');
    this.showInstruccions.set(true);
    this.showMenu.set(false);
  }
  quit() {
    this.router.navigate(['/']);
  }

  // Game options
  startGame() {
    this.letterCondition.set('bi-check2', 'd-none');
    this.letterCondition.set('bi-backspace-fill', 'd-none');
    this.showKeyboard.set(true);
    this.showInstruccions.set(false);
    this.showGameOption.set(false);
    this.btn1GameOptions.set('Reiniciar');
    this.btn2GameOptions.set('Volver');
    this.isPlaying.set(true);
    this.idTime = setInterval(() => {
      this.time.update(s => s + 1);
    }, 1000);
  }
  replay() {
    this.word = [];
    this.usedLetters = [];
    this.letterCondition.clear();
    this.titleGameOptions.set('');
    this.btn1GameOptions.set('');
    this.btn2GameOptions.set('');
    this.showGameOption.set(false);
    this.lifes.set(7);
    this.showInstruccions.set(true);
    this.time.set(0);
    this.finalTime.set(0);
  }
  goToMenu() {
    this.replay();
    this.showKeyboard.set(true);
    this.showMenu.set(true);
  }

  option1() {
    if (this.mode() === 'multiplayer') {
      this.replay();
    } else if (this.mode() === 'singleplayer') {
      if (this.btn1GameOptions() === 'Reiniciar') {
        this.replay();
        this.showKeyboard.set(false);
        this.titleGameOptions.set('Dificultad');
        this.btn1GameOptions.set('Fácil');
        this.btn2GameOptions.set('Difícil');
        this.showGameOption.set(true);
      } else {
        const randomNumber = Math.floor(Math.random() * this.singleplayerEasyMode.length);
        this.word = [...this.singleplayerEasyMode[randomNumber].toUpperCase()];
        this.startGame();
      }
    }
  }
  option2() {
    if (this.mode() === 'multiplayer') {
      this.goToMenu();
    } else if (this.mode() === 'singleplayer') {
      if (this.btn2GameOptions() === 'Volver') {
        this.goToMenu();
      } else {
        const randomNumber = Math.floor(Math.random() * this.singleplayerHardMode.length);
        this.word = [...this.singleplayerHardMode[randomNumber].toUpperCase()];
        this.startGame();
      }
    }
  }

  async sendToDB(won: boolean) {
    await this.results.saveResultGame('Ahorcado', won, {
      time: this.finalTime(),
      usedLetters: this.usedLetters,
      word: this.word,
      lifes: this.lifes(),
      mode: this.mode()
    })
  }

  onLetterPressed(letter: string) {
    console.log('Tecla presionada:', letter);
    if (letter === 'bi-check2') {
      if (this.word.length === 0) return
      this.startGame();
    } else if (letter === 'bi-backspace-fill') {
      this.word.pop();
    } else {
      if (!this.isPlaying()) {
        if (this.word.length < 10) this.word.push(letter);
      }
      else {
        this.letterCondition.set(letter, 'disabled');
        this.usedLetters.push(letter);
        if (!this.word.includes(letter)) this.lifes.update(v => v - 1);
        if (this.lifes() <= 0) {
          this.isPlaying.set(false);
          this.finalTime.set(this.time())
          this.showGameOption.set(true);
          this.titleGameOptions.set('¡Perdiste!');
          this.letterCondition.set('all', 'inactive');
          clearInterval(this.idTime);
          this.sendToDB(false);
        }
        if (this.word.every(letter => this.usedLetters.includes(letter))) {
          this.isPlaying.set(false);
          this.finalTime.set(this.time())
          this.showGameOption.set(true);
          this.titleGameOptions.set('¡Ganaste!');
          this.letterCondition.set('all', 'inactive');
          clearInterval(this.idTime);
          this.sendToDB(true);
        }
      }
    }
  }
}