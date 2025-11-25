import { MatIcon } from '@angular/material/icon';
import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { WalletComponent } from '../../../components/wallet/wallet.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { WalletsService } from '../../../services/wallets.service';
@Component({
    selector: 'wallets',
    styleUrl: './wallets.component.scss',
    imports: [MatIcon, MatButtonModule, WalletComponent],
    template: `
        <h2 class="leftTitle">Carteiras de Investimentos</h2>

        <section class="wallets">
            <section class="walletsGrid">
                @for(wallet of wallets(); track $index){
                    <wallet [wallet]="wallet" (value)="updateTotalValue($event)"/>
                }
                <div class="small-box" (click)="this.router.navigate(['/home/wallets/new'])">
                    <mat-icon>add_circle_outline</mat-icon>
                    <h2 class="title">Criar uma caixinha</h2>
                </div>
            </section>
        </section>
        <section class="info">
            <div class="small-box">
                <label>Saldo total:</label>
                <h2 [innerHTML]="formatMoney(total())" class="green"></h2>
            </div>
            <div class="small-box">
                <label>Total investido:</label>
                <h2 [innerHTML]="formatMoney(invested())"></h2>
            </div>
            <div class="small-box">
                <label>Rendimento total:</label>
                <h2 [innerHTML]="formatMoney(total() - invested())" class="green"></h2>
            </div>
        </section>
        
        
    `
})
export class WalletsComponent {
    protected router = inject(Router)
    protected accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()
    protected walletsService = inject(WalletsService)
    protected wallets = this.walletsService.getHoldings()
    protected total = signal<number>(0)
    protected invested = signal<number>(0)
    protected values: any[] = []

    updateTotalValue(value: any){
        this.values.push(value)
        if (this.values.length === this.wallets().length) {
            this.total.set(0);
            this.invested.set(0);

            for (const v of this.values) {
                this.total.update(t => t + v.total);
                this.invested.update(i => i + v.invested);
            }
            this.values = [];
        }
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