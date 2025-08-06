import { MatIcon } from '@angular/material/icon';
import { Component } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CreditCardComponent } from '../../../components/credit-card/credit-card.component';

@Component({
    selector: 'credit-cards',
    styleUrl: './credit-cards.component.scss',
    imports: [MatIcon, MatButtonModule, CommonModule, CreditCardComponent],
    template: `
        <h2 class="title">CARTÕES DE CRÉDITO</h2>

        <div class="box cardAdd">
            <mat-icon>add_circle</mat-icon>
            <h2>NOVO CARTÃO DE CRÉDITO</h2>
        </div>
        
        <credit-card/>
    `
})
export class CreditCardsComponent {

}