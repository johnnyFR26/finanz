import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Component, computed, inject, input } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'credit-card',
    imports: [MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, CommonModule, MatMenuModule],
    styleUrl: './credit-card.component.scss',
    template: `
      <div class="box card">
        <div class="name">
            <img src="/credit-card/mastercard.svg">
            <h3>{{ creditCard().name}}</h3>
            <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
            <mat-menu #menu="matMenu">
                <button mat-menu-item><mat-icon>attach_money</mat-icon>Pagar Fatura</button>
            </mat-menu>
        </div>
        <div class="cardContent">
            <p>FATURA ABERTA</p>
            <div>VALOR PARCIAL: <span [ngClass]="percentage() >= 70 ? 'low' : 'high'">{{expense() | currency:account()?.currency}}</span></div>
            <div>FECHA EM: <span>{{date | date:"dd 'DE' MMMM 'DE' yyyy"}}</span></div><!-- tem que arrumar de inglês pra português-->

            <p style="margin-top:10px;margin-bottom:0;">{{expense() | currency:account()?.currency}} de {{creditCard().limit | currency:account()?.currency}}</p>
            <mat-progress-bar mode="determinate" [ngClass]="percentage() >= 70 ? 'low' : 'high'" [value]="percentage()" [attr.data]="percentage()"></mat-progress-bar>

            <div style="margin-top: 20px;">
                {{creditCard().availableLimit| currency:account()?.currency}} DISPONÍVEL
                <button mat-button>ADICIONAR DESPESAS</button>
            </div>
        </div>
      </div>
    `
})

export class CreditCardComponent{
    protected percentage = computed((): number => Number((this.expense() / this.creditCard().limit *100).toFixed(2)));
    protected expense = computed(() => this.creditCard().limit - this.creditCard().availableLimit);
    protected date = new Date();

    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()

    public creditCard = input({
        name: 'My credit card',
        limit: 1000,
        availableLimit: 1000,

    })
}