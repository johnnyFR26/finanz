import { Component, inject } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { CurrencyPipe } from "@angular/common";

@Component({
    selector: 'credit-card-select',
    imports: [CurrencyPipe],
    styleUrl: './credit-card-select.component.scss',
    template: `
    <div class="box card">
              <div class="currency">
                <h2>CARTÃO DE CRÉDITO</h2>
                <h1>{{account()?.currentValue | currency: 'BRL'}}</h1>
              </div>
              <div class="animation">
                <select class="input" name="type" id="input">
                </select>
                <label for="input">Cartão</label>
              </div>
          </div>
          `
})
export class CreditCardSelectComponent{
    
    private accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()
}