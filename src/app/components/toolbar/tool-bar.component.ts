import { Component, Input } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'

@Component({
    selector: 'app-tool-bar',
    template: `
        <mat-toolbar>
          <button (click)="sidenav.toggle()" mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
        <mat-icon>menu</mat-icon>
        </button>
        <span>Finanz</span>
        <span class="example-spacer"></span>
        <button mat-icon-button class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
        <mat-icon>favorite</mat-icon>
        </button>
        <button mat-icon-button class="example-icon" aria-label="Example icon-button with share icon">
        <mat-icon>share</mat-icon>
        </button>
    </mat-toolbar>
    `,
    imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule],
    styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent{

    @Input() sidenav!: MatSidenav
}