import { Routes } from '@angular/router';
import { isUserLogged } from './guards/is-user-logged.can-activate.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [isUserLogged]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/log-in/log-in.component').then(m => m.LogInComponent)
    },
    {
        path: 'signin',
        loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent)
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
