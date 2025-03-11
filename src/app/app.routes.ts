import { CanActivate } from '@angular/router';
import { Routes } from '@angular/router';
import { isUserLogged } from './guards/is-user-logged.can-activate.guard';
import { doesUserHaveAccount } from './guards/does-user-have-account.can-activate.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [isUserLogged],
        children: [
            {
                path: 'dev',
                loadComponent: () => import('./pages/home/developers/dev.component').then(m => m.DevComponent)
            },
            {
                path: 'createAccount',
                loadComponent: () => import('./pages/home/createAccount/create-account.component').then(m => m.CreateAccountComponent)
            },
            {
                path: 'account',
                loadComponent: () => import('./pages/home/account/account.component').then(m => m.AccountComponent),
                canActivate: [doesUserHaveAccount]
            }
        ]
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
        path: 'dev',
        loadComponent: () => import('./pages/home/developers/dev.component').then(m => m.DevComponent)
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
