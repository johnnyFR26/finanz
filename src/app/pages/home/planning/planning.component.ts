import { MatIcon } from '@angular/material/icon';
import { Component, inject , input } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../../services/transaction.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlanComponent } from '../../../components/plan/plan.component';
import { MonthSelectorComponent } from "../../../components/month-selector/month-selector.component";

@Component({
    selector: 'planning',
    styleUrl: './planning.component.scss',
    imports: [PlanComponent, MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, MonthSelectorComponent],
    template: `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@200&icon_names=balance,payments" />
        
        <h2 class="title">PLANEJAMENTO</h2>

        <month-selector/>

        <div class="remaining">
            <h2>RESTAM</h2>
            <h1>{{ remaining | currency:"BRL"}}</h1>
        </div>

        <div class="TWOxTWO">
            <div class="small-box gains">
                <h2>RECEITAS</h2>
                <div><h1>{{revenues| currency: 'BRL'}}</h1>
                <mat-icon>forward</mat-icon></div>
            </div>
            <div class="small-box losts">
                <h2>GASTOS PLANEJADOS</h2>
                <div><h1>{{expenses | currency: 'BRL'}}</h1>
                <mat-icon>forward</mat-icon></div>
            </div>
            <div class="small-box balance">
                <h2>BALANÇO PLANEJADO</h2>
                <div><h1>{{balance| currency: 'BRL'}}</h1>
                <span class="material-symbols-outlined">balance</span></div>
            </div>
            <div class="small-box economy">
                <h2>ECONOMIA PLANEJADA</h2>
                <div><h1>{{economy + "%"}}</h1>
                <span class="material-symbols-outlined">payments</span></div>
            </div>
        </div> 

        <div class="box">
            <plan/>
            <plan/>
        </div>
    `
})
export class PlanningComponent {
    protected revenues = 1059;
    protected expenses = 900;
    protected remaining = 600;
    protected balance = 900;
    protected economy = 26.90;
}