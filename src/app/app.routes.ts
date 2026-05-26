import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { ResultsPage } from './components/results/results';
import { authGuard } from './guards/auth';
import { clientGuard } from './guards/client';
import { Ahorcado } from './games/ahorcado/ahorcado';
import { MayorMenor } from './games/mayor-menor/mayor-menor';
import { Preguntados } from './games/preguntados/preguntados';
import { Wordle } from './games/wordle/wordle';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login, canActivate: [clientGuard] },
  { path: 'signup', component: Signup, canActivate: [clientGuard] },
  { path: 'results', component: ResultsPage, canActivate: [authGuard] },
  { path: 'games/ahorcado', component: Ahorcado, canActivate: [authGuard] },
  { path: 'games/mayor_o_menor', component: MayorMenor, canActivate: [authGuard] },
  { path: 'games/preguntados', component: Preguntados, canActivate: [authGuard] },
  { path: 'games/wordle', component: Wordle, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];