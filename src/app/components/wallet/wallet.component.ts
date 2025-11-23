import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, Component, inject, input } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { HoldingModel } from '../../models/holding.model';

@Component({
    selector: 'wallet',
    imports: [MatIcon, MatButtonModule, CurrencyPipe, CommonModule],
    styleUrl: './wallet.component.scss',
    template: `
        <div class="small-box">
            <span class="type">
                Investimento de rendimento {{type}}:
            </span>
            <section class="info">
                <mat-icon>{{wallet().controls?.icon}}</mat-icon>
                <section class="description">
                    <h1>{{wallet().name}}</h1>
                    <p>{{wallet().controls?.description}}</p>
                </section>
            </section>
            <details>
                <summary>Detalhes</summary>
                <section>
                    <span><span>Investimento Inicial:</span>
                        <span class="data">{{wallet().movimentations[0].value | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{type}}(%)</span>:</span>
                        <span class="data">{{wallet().tax}}%</span>
                    </span>
                    
                    <span><span>Rendimento <span class="green">{{type}}($)</span>:</span>
                        <span class="data">{{wallet().tax/100 * wallet().movimentations[0].value | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Saldo Atual:</span>
                        <span class="data">{{total | currency: account()?.currency}}</span>
                    </span>
                    
                    <span><span>Tempo decorrido (<span class="green">{{wallet().controls?.type === 'monthly' ? 'meses' : 'dias'}}</span>):</span>
                        <span class="data">{{passedTime}}</span>
                    </span>
                </section>
            </details>
            <div class="comparison">
                <span [innerHTML]="formatMoney(wallet().movimentations[0].value)"></span>
                <hr/>
                <span class="green" [innerHTML]="formatMoney(total)"></span>
            </div>
        </div>
            

    `
})

export class WalletComponent implements AfterViewInit{
    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()
    
    public wallet = input(<HoldingModel>{
        name: 'Carteira',
        total: 100,
        tax: 10,
        movimentations: [
            {
                value: 100,
            }
        ],
        createdAt: new Date(2025, 1, 20),
        dueDate: new Date(),
        controls: {
            icon: 'account_balance',
            description: 'fundos de emergência',
            type: 'monthly',
            compound: true,
        },
    })
    protected type = "";
    protected passedTime = 0;
    protected total = this.wallet().movimentations[0].value + this.wallet().movimentations[0].value * this.wallet().tax * this.passedTime / 100;

    ngAfterViewInit(): void {
    this.type = this.wallet().controls?.type === "monthly" ? "mensal" : "diário";
    this.passedTime = this.wallet().controls?.type === "monthly" ? this.subMonthDate(new Date(), this.wallet().createdAt) : this.subDayDate(new Date(), this.wallet().createdAt);
    this.total = this.wallet().movimentations[0].value + this.wallet().movimentations[0].value * this.wallet().tax * this.passedTime / 100;

    }
    
    subMonthDate(date1: Date, date2: Date){
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();

        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();

        let months = (year1 - year2) * 12 + month1 - month2;

        if(day1 < day2){
            months--;
        }
        return months;
    }

    subDayDate(date1: Date, date2: Date){
        let days = Math.floor((date1.getTime() - date2.getTime()) / 86400000);
        return days;
    }
    
    
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