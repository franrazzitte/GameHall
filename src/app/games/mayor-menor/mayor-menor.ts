import { Component, signal, inject } from '@angular/core';
import { Results } from '../../services/results';

@Component({
  selector: 'app-mayor-menor',
  imports: [],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css',
})
export class MayorMenor {
  private results = inject(Results);

  isPlaying = signal(false);
  cartas = ['basto5', 'basto6', 'basto7', 'basto10', 'copa3', 'copa8', 'copa9', 'copa12', 'espada2', 'espada5', 'espada8', 'espada11', 'oro1', 'oro4', 'oro7', 'oro10'];
  carta1 = signal('carta');
  carta2 = signal('carta');
  puntaje = signal(0);
  isProcessing = signal(false);
  result = signal('');

  async sendToDB() {
    await this.results.saveResultGame('MayorMenor', null, {
      score: this.puntaje()
    })
  }

  startGame() {
    this.isPlaying.set(true);
    this.puntaje.set(0);
    this.carta1.set(this.getRandomCard());
    this.carta2.set('carta');
    this.result.set('');
  }

  getRandomCard(carta?: string): string {
    let nuevaCarta: string;
    do {
      const randomIndex = Math.floor(Math.random() * this.cartas.length);
      nuevaCarta = this.cartas[randomIndex];
    } while (this.getNumberCard(nuevaCarta) === this.getNumberCard(carta ?? ''));
    
    return nuevaCarta;
  }

  getNumberCard(carta: string): number {
    return Number(carta.replace('basto', '').replace('copa', '').replace('espada', '').replace('oro', ''));
  }

  mayor() {
    this.play('mayor');
  }

  menor() {
    this.play('menor');
  }

  play(type: 'mayor' | 'menor') {
    if (!this.isPlaying() || this.isProcessing()) return;

    this.isProcessing.set(true);

    const cartaActual = this.carta1();
    const nuevaCarta = this.getRandomCard(cartaActual);
    
    this.carta2.set(nuevaCarta);

    const numeroCarta1 = this.getNumberCard(cartaActual);
    const numeroCarta2 = this.getNumberCard(nuevaCarta);

    let correct = false;
    if (type === 'mayor') correct = numeroCarta2 > numeroCarta1;
    if (type === 'menor') correct = numeroCarta2 < numeroCarta1;

    if (correct) this.result.set('¡Correcto! +1 punto');
    else {
      this.result.set(`¡Perdiste! Puntaje final: ${this.puntaje()}`);
      this.sendToDB();
    }

    setTimeout(() => {
      if (correct) {
        this.puntaje.update(v => v + 1);
        this.carta1.set(nuevaCarta);
        this.carta2.set('carta');
        this.result.set('');
      } else {
        this.isPlaying.set(false);
      }
      this.isProcessing.set(false);
    }, 1500);
  }
}
