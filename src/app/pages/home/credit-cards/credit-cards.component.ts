import { MatIcon } from '@angular/material/icon';
import { Component, inject } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CreditCardComponent } from '../../../components/credit-card/credit-card.component';
import { Router, RouterOutlet } from '@angular/router';
import { CreditCardService } from '../../../services/credit-card.service';

@Component({
    selector: 'credit-cards',
    styleUrl: './credit-cards.component.scss',
    imports: [MatIcon, MatButtonModule, CreditCardComponent, RouterOutlet],
    template: `
        <h2 class="title">CARTÕES DE CRÉDITO</h2>

        <router-outlet></router-outlet>

        <div (click)="this.router.navigate(['/home/creditCard/new'])" class="box cardAdd">
            <mat-icon>add_circle</mat-icon>
            <h2>NOVO CARTÃO DE CRÉDITO</h2>
        </div>
        <div class="cards">
            @for (card of creditCards(); track $index) {
                <credit-card [creditCard]="card"/>
            }
        </div>
    `
})
export class CreditCardsComponent {
    private creditCardService = inject(CreditCardService)
    protected creditCards = this.creditCardService.getCurrentCreditCard()
    protected router = inject(Router)
}