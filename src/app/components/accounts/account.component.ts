import { MatIcon } from '@angular/material/icon';
import { Component, inject } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'account',
    imports: [MatIcon, MatButtonModule, CurrencyPipe, CommonModule],
    styleUrl: './account.component.scss',
    template: `
    <div class="box card">
            <div class="name">
                <mat-icon>monetization_on</mat-icon>
                <h3>CARTEIRA</h3>
                <button mat-icon-button><mat-icon>more_vert</mat-icon></button>
            </div>
            <div class="cardContent">
                <div>SALDO ATUAL: <span>{{actualBalance | currency:account()?.currency}}</span></div>
                <div>SALDO PREVISTO: <span>{{predictedBalance | currency:account()?.currency}}</span></div>
                <hr>
                <button mat-button class="gains">ADICIONAR RECEITAS</button>
                <button mat-button class="loses">ADICIONAR DESPESAS</button>
            </div>

        </div>
    `
})

export class AccountComponent{
    protected actualBalance = 1000;
    protected predictedBalance = 250;

    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()
}