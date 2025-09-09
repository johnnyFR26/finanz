import { Component, inject, signal } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { CurrencyPipe } from "@angular/common";
import { CreditCardService } from "../../services/credit-card.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'credit-card-select',
    imports: [CurrencyPipe, FormsModule],
    styleUrl: './credit-card-select.component.scss',
    template: `
    <div class="box creditCard">
              <div class="currency">
                <h2>CARTÃO DE CRÉDITO</h2>
                <h1>{{currentCardLimit() | currency: account()?.currency}}</h1>
              </div>
              <div class="animation">
                <select [(ngModel)]="currentCardLimit" class="input" name="type" id="input">
                  @for(creditCard of creditCards(); track $index){
                    <option [value]="creditCard.availableLimit">{{creditCard.name}}</option>
                  }
                </select>
                <label for="input">Cartão</label>
              </div>
          </div>
          `
})
export class CreditCardSelectComponent{
    
    private accountService = inject(AccountService);
    protected account = this.accountService.getCurrentAccount();
    private creditCardService = inject(CreditCardService);
    protected creditCards = this.creditCardService.getCurrentCreditCard();
    protected currentCardLimit = signal(0.00)
}