import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { AccountService } from "../../../services/account.service";

@Component({
    selector: 'app-account',
    template: `
        <h1>Conta: {{account()?.currentValue | currency: 'BRL'}}</h1>
    `,
    styleUrl: './account.component.scss',
    imports: [CurrencyPipe]
})
export class AccountComponent implements OnInit{

    ngOnInit(): void {     
        console.table(this.account)
    }
    private accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()

}