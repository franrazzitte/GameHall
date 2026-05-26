import { Component, inject, signal, computed } from '@angular/core';
import { Router } from "@angular/router";
import { PreguntadosService } from '../../services/preguntados';
import { PreguntadosQuestions } from '../../models/models';
import { Results } from '../../services/results';

@Component({
  selector: 'app-preguntados',
  imports: [],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados {
  private router = inject(Router);
  private results = inject(Results);
  private preguntadosAPI = inject(PreguntadosService);

  showMenu = signal(true);
  showInstructions = signal(true);
  showGameOption = signal(false);
  
  questions = signal<PreguntadosQuestions[]>([]);
  questionIndex = signal(0);
  score = signal(0);
  gameFinished = signal(false);
  selectedAnswer = signal('');
  isLoading = signal(false);
  actualQuestion = signal<any>([]);

  async sendToDB() {
    await this.results.saveResultGame('Preguntados', null, {
      score: this.score()
    })
  }

  quit() {
    this.router.navigate(['/']);
  }

  async startGame() {
    this.showMenu.set(false);
    this.isLoading.set(true);
    this.questionIndex.set(0);
    this.score.set(0);
    this.gameFinished.set(false);
    this.selectedAnswer.set('');
    const questions = await this.preguntadosAPI.getQuestions();
    this.questions.set(questions || '');
    this.actualQuestion.set(this.questions()[0]);
    this.isLoading.set(false);
  }

  selectAnswer(option: string) {
    if (this.selectedAnswer()) return;
    this.selectedAnswer.set(option);

    const correctAnswer = this.actualQuestion()?.correctAnswer;

    if (option === correctAnswer) this.score.update(v => v + 1);

    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion() {
    const newIndex = this.questionIndex() + 1;
    this.actualQuestion.set(this.questions()[newIndex]);

    if (newIndex >= this.questions().length) {
      this.gameFinished.set(true);
      this.sendToDB();
      return;
    }

    this.selectedAnswer.set('');
    this.questionIndex.set(newIndex);
  }

  decodeText(text: string): string {
    return decodeURIComponent(text);
  }
}