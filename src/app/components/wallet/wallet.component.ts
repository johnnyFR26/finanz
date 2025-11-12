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
                Investimento de rendimento {{wallet().controls.type}}:
            </span>
            <section class="info">
                <mat-icon>{{wallet().controls.icon}}</mat-icon>
                <section class="description">
                    <h1>{{wallet().name}}</h1>
                    <p>{{wallet().controls.description}}</p>
                </section>
            </section>
            <details>
                <summary>Detalhes</summary>
                <section>
                    <span><span>Investimento Inicial:</span>
                        <span class="data">{{wallet().movimentations[0].value | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{wallet().controls.type}}(%)</span>:</span>
                        <span class="data">{{wallet().tax}}%</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{wallet().controls.type}}($)</span>:</span>
                        <span class="data">{{wallet().tax/100 * wallet().movimentations[0].value | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Saldo Atual:</span>
                        <span class="data">{{wallet().total | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Tempo decorrido (<span class="green">{{wallet().controls.type }}</span>):</span>
                        <span class="data">{{passedTime}}</span>
                    </span>
                </section>
            </details>
            <div class="comparison">
                <span [innerHTML]="formatMoney(wallet().movimentations[0].value)"></span>
                <hr/>
                <span class="green" [innerHTML]="formatMoney(wallet().total)"></span>
            </div>
        </div>
            

    `
})

export class WalletComponent{
    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()
    
    public wallet = input({
        name: 'Carteira',
        tax: 10,
        total: 130,
        movimentations: [
            {
                value: 100,
            }
        ],
        createdAt: new Date(),
        
        controls:{
            icon: 'account_balance',
            description: 'fundos de emergência',
            type: 'mensal',
        },
    })
    readonly passedTime = new Date().getMonth() - this.wallet().createdAt.getMonth();

    
    formatMoney(value: number){
        const currency = this.account()?.currency ;
        const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(value);

        const [money, cents] = formatted.split(',');
        return `${money},<span class="cents">${cents}</span>`;
    }
}