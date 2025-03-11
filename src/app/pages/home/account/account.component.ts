import { CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { AccountService } from "../../../services/account.service";

@Component({
    selector: 'app-account',
    template: `
        <h1>Conta: {{account()?.currentValue | currency: 'BRL'}}</h1>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe]
})
export class AccountComponent{

    private accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()

}