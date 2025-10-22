import { MatIcon } from '@angular/material/icon';
import { Component, inject, input } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'wallet',
    imports: [MatIcon, MatButtonModule, CurrencyPipe, CommonModule],
    styleUrl: './wallet.component.scss',
    template: `
        <div class="small-box">
            <span class="type">
                Investimento de rendimento {{wallet().type}}:
            </span>
            <section class="info">
                <mat-icon>{{wallet().icon}}</mat-icon>
                <section class="description">
                    <h1>{{wallet().name}}</h1>
                    <p>{{wallet().description}}</p>
                </section>
            </section>
            <details>
                <summary>Detalhes</summary>
                <section>
                    <span><span>Investimento Inicial:</span>
                        <span class="data">{{wallet().initial | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{wallet().type}}(%)</span>:</span>
                        <span class="data">{{wallet().performancePer | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{wallet().type}}($)</span>:</span>
                        <span class="data">{{wallet().performancePer/100 * wallet().initial | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Saldo Atual:</span>
                        <span class="data">{{wallet().initial | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Tempo decorrido (<span class="green">{{wallet().type === "mensal" ? "mêses": "dias" }}</span>):</span>
                        <span class="data">{{wallet().initial | currency: account()?.currency}}</span>
                    </span>
                </section>
            </details>
            <div class="comparison">
                <span>{{wallet().initial | currency: account()?.currency}}</span>
                <hr/>
                <span class="green">{{wallet().actual | currency: account()?.currency}}</span>
            </div>
        </div>
            

    `
})

export class WalletComponent{
    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()
    
    public wallet = input({
        icon: 'account_balance',
        name: 'Carteira',
        description: 'fundos de emergência',
        type: 'mensal',
        initial: 100,
        performancePer: 100,
        actual: 130,
        time: 3,
    })
}