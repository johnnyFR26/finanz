import { MatIcon } from '@angular/material/icon';
import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { WalletComponent } from '../../../components/wallet/wallet.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
@Component({
    selector: 'wallets',
    styleUrl: './wallets.component.scss',
    imports: [MatIcon, MatButtonModule, WalletComponent],
    template: `
        <h2 class="leftTitle">Carteiras de Investimentos</h2>

        <section class="wallets">
            <section class="walletsGrid">
                @for(wallet of wallets(); track $index){
                    <wallet [wallet]="wallet"/>
                }
                <wallet/>
                <div class="small-box" (click)="this.router.navigate(['/home/wallets/new'])">
                    <mat-icon>add_circle_outline</mat-icon>
                    <h2 class="title">Criar uma caixinha</h2>
                </div>
            </section>
        </section>
        <section class="info">
            <div class="small-box">
                <label>Saldo total:</label>
                <h2 [innerHTML]="formatMoney(390)" class="green"></h2>
            </div>
            <div class="small-box">
                <label>Total investido:</label>
                <h2 [innerHTML]="formatMoney(300)"></h2>
            </div>
            <div class="small-box">
                <label>Rendimento total:</label>
                <h2 [innerHTML]="formatMoney(90)" class="green"></h2>
            </div>
        </section>
        
        
    `
})
export class WalletsComponent {
    wallets = signal([])
    protected router = inject(Router)
    protected accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()

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