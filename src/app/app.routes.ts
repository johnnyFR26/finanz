import { Routes } from '@angular/router';
import { isUserLogged } from './guards/is-user-logged.can-activate.guard';
import { doesUserHaveAccount } from './guards/does-user-have-account.can-activate.guard';
import { isUserPlanPremium } from './guards/is-user-plan-premium.can.activate.guard';

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
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'wallets',
                loadComponent: () => import('./pages/home/wallets/wallets.component').then(m => m.WalletsComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'wallets/new',
                loadComponent: () => import('./pages/home/wallets/new/new-wallet.component').then(m => m.NewWalletComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'accounts',
                loadComponent: () => import('./pages/home/accounts/accounts.component').then(m => m.AccountsComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'transactions',
                loadComponent: () => import('./pages/home/transactions-list/transactions-list.component').then(m => m.TransactionsListComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'creditCard',
                loadComponent: () => import('./pages/home/credit-cards/credit-cards.component').then(m => m.CreditCardsComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'creditCard/new',
                loadComponent: () => import('./pages/home/credit-cards/new/new-credit-card.component').then(m => m.NewCreditCardComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'IA',
                loadComponent: () => import('./pages/home/IA/ia.component').then(m => m.IAComponent),
                canActivate: [doesUserHaveAccount, isUserPlanPremium],
            },
            {
                path: 'planning',
                loadComponent: () => import('./pages/home/planning/planning.component').then(m => m.PlanningComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'planning/new',
                loadComponent: () => import('./pages/home/planning/new/new-planning.component').then(m => m.NewPlanningComponent),
                canActivate: [doesUserHaveAccount],
            },
            {
                path: 'my-account',
                loadComponent: () => import('./pages/home/my-account/my-account.component').then(m => m.MyAccountComponent),
                canActivate: [doesUserHaveAccount],
            },
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
        redirectTo: 'home/account',
        pathMatch: 'full'
    }
];
