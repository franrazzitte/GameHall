import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { authGuard } from './guards/auth';
import { clientGuard } from './guards/client';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [clientGuard] },
  { path: 'signup', component: Signup, canActivate: [clientGuard] },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' }
];