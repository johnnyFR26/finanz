import { MatIcon } from '@angular/material/icon';
import { Component, input } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'credit-card',
    imports: [MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, CommonModule],
    styleUrl: './credit-card.component.scss',
    template: `
      <div class="box card">
        <div class="name">
            <img src="/credit-card/mastercard.svg">
            <h3>{{ creditCard().name}}</h3>
            <button mat-icon-button><mat-icon>more_vert</mat-icon></button>
        </div>
        <div class="cardContent">
            <p>FATURA ABERTA</p>
            <div>VALOR PARCIAL: <span>{{actualValue | currency:"BRL"}}</span></div>
            <div>FECHA EM: <span>{{date | date:"dd 'DE' MMMM 'DE' yyyy"}}</span></div><!-- tem que arrumar de inglês pra português-->

            <p style="margin-top:10px;margin-bottom:0;">{{actualValue | currency:"BRL"}} de {{limit | currency:"BRL"}}</p>
            <mat-progress-bar mode="determinate" [value]="percentage" [attr.data]="percentage"></mat-progress-bar>

            <div style="margin-top: 20px;">
                {{balance | currency:"BRL"}} DISPONÍVEL
                <button mat-button>ADICIONAR DESPESAS</button>
            </div>
        </div>

    </div>
    `
})

export class CreditCardComponent{
    protected limit = 1000;
    protected actualValue = 250;
    protected percentage = this.actualValue / this.limit * 100;
    protected balance = this.limit - this.actualValue;
    protected date = new Date();

    public creditCard = input({
        name: 'My credit card',
        limit: 1000
    })
}