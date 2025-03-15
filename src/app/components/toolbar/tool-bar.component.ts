import { Component, inject, Input } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { UserService } from "../../services/user.service";
import { AccountService } from "../../services/account.service";
import { CurrencyPipe } from "@angular/common";

@Component({
    selector: 'app-tool-bar',
    template: `
        <mat-toolbar>
          <button (click)="sidenav.toggle()" mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
        <mat-icon>menu</mat-icon>
        </button>
        <span>Finanz</span>
        <span class="example-spacer"></span>
        <button (click)="copyToClipboard()" mat-icon-button class="example-icon" aria-label="Example icon-button with share icon">
        <mat-icon>share</mat-icon>
        </button>
        <span class="name-user">{{ user()?.user?.name }}</span>
    </mat-toolbar>
    `,
    imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule],
    styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent{

    private userService = inject(UserService)
    private accountService = inject(AccountService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()

    @Input() sidenav!: MatSidenav
    private clipboard = inject(Clipboard)

    copyToClipboard(){
        this.clipboard.copy('https://finanz-beta.vercel.app')
    }
}