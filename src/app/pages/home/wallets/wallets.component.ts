import { MatIcon } from '@angular/material/icon';
import { Component, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { WalletComponent } from '../../../components/wallet/wallet.component';
@Component({
    selector: 'wallets',
    styleUrl: './wallets.component.scss',
    imports: [MatIcon, MatButtonModule, WalletComponent],
    template: `
        <h2 class="leftTitle">Carteiras de Investimentos</h2>

        <section class="wallets">
            @for(wallet of wallets(); track $index){
                <wallet [wallet]="wallet"/>
            }
            <wallet/>
            <div class="small-box">
                <mat-icon>add_circle_outline</mat-icon>
                <h2 class="title">Criar uma caixinha</h2>
            </div>
        </section>

        
        
    `
})
export class WalletsComponent {
    wallets = signal([])
}