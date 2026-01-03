import { Component, inject, Input } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { UserService } from "../../services/user.service";
import { AccountService } from "../../services/account.service";
import { MatDialog } from "@angular/material/dialog";
import { UserModalComponent } from "../../modals/user-modal/user-modal.component";
import { ThemeService } from "../../services/themeService";

@Component({
    selector: 'app-tool-bar',
    template: `
        <mat-toolbar>
            <button (click)="sidenav.toggle()" mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
                <mat-icon>menu</mat-icon>
            </button>
            <img [src]="logo" class="Logo"/>
            <button mat-icon-button class="name-user" (click)="openDialog()" aria-label="Example icon-button with share icon">
                <mat-icon class="icon" >account_circle</mat-icon>
            </button>
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
    readonly dialog = inject(MatDialog)
    readonly themeService = inject(ThemeService)

    openDialog(): void {
        this.dialog.open(UserModalComponent, {
          
        });
    }


    get logo() {
        return this.themeService.getDarkTheme() ? "FINANZ.png" : "B-FINANZ.png";
    }

    @Input() sidenav!: MatSidenav
}