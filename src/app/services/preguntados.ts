import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PreguntadosQuestions } from '../models/models'

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private apiUrl = 'https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple&encode=url3986';
  private http = inject(HttpClient);

  async getQuestions() {
    try {
      const api = await firstValueFrom(this.http.get<any>(this.apiUrl));
      const results: PreguntadosQuestions[] = [];
      const apiResults = api.results;

      for(let i = 0; i < 10; i++) {
        results.push({
          question: decodeURIComponent(apiResults[i].question),
          correctAnswer: apiResults[i].correct_answer,
          answers: [apiResults[i].correct_answer, ...apiResults[i].incorrect_answers].sort(() => Math.random() - 0.5)
        });
      }
      return results;
    } catch(error) {
      console.error('Error');
      return [];
    }
  }
}