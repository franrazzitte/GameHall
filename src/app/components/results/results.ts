import { Component, inject, signal, OnInit } from '@angular/core';
import { Results } from '../../services/results';
import { ResultsStruc } from '../../models/models';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class ResultsPage implements OnInit {
  private resultsService = inject(Results);

  tableGames: ResultsStruc[] = [
    { title: 'Ahorcado', scoreTitle: 'Cant. Letras Seleccionadas', data: signal<any[]>([]) },
    { title: 'Mayor o Menor', scoreTitle: 'Cant. Cartas Acertadas', data: signal<any[]>([]) },
    { title: 'Preguntados', scoreTitle: 'Cant. Preguntas Acertadas', data: signal<any[]>([]) },
    { title: 'Wordle', scoreTitle: 'Puntos', data: signal<any[]>([]) }
  ];

  get ahorcado() { return this.tableGames[0].data; }
  get mayorMenor() { return this.tableGames[1].data; }
  get preguntados() { return this.tableGames[2].data; }
  get wordle() { return this.tableGames[3].data; }

  async ngOnInit() {
    await this.loadResults();
  }

  async loadResults() {
    try {
      const [dataAhorcado, dataMayorMenor, dataPreguntados, dataWordle] = await Promise.all([
        this.resultsService.getResults('Ahorcado'),
        this.resultsService.getResults('MayorMenor'),
        this.resultsService.getResults('Preguntados'),
        this.resultsService.getResults('Wordle')
      ]);

      this.ahorcado.set(this.sortResults(dataAhorcado));
      this.mayorMenor.set(this.sortResults(dataMayorMenor));
      this.preguntados.set(this.sortResults(dataPreguntados));
      this.wordle.set(this.sortResults(dataWordle));
    } catch (error) {
      console.error(error);
    }
  }

  sortResults(results: any[]): any[] {
    if (!results) return [];
    return [...results].sort((a, b) => b.data.score - a.data.score).slice(0, 10);
  }
}