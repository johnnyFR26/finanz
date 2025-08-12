import { MatIcon } from '@angular/material/icon';
import { Component } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { AccountComponent } from '../../../components/accounts/account.component';
@Component({
    selector: 'accounts',
    styleUrl: './accounts.component.scss',
    imports: [MatIcon, MatButtonModule, AccountComponent],
    template: `
        <h2 class="title">CONTAS</h2>

        <div class="box cardAdd">
            <mat-icon>add_circle</mat-icon>
            <h2>NOVA CONTA</h2>
        </div>

        <account/>
        
        
    `
})
export class AccountsComponent {
}