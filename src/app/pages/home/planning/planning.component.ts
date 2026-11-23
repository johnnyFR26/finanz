import { AccountService } from './../../../services/account.service';
import { MatIcon } from '@angular/material/icon';
import { Component, computed, inject } from "@angular/core";
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlanComponent } from '../../../components/plan/plan.component';
import { MonthSelectorComponent } from "../../../components/month-selector/month-selector.component";
import { Router } from '@angular/router';
import { PlanningService } from '../../../services/planning.service';

@Component({
    selector: 'app-planning',
    styleUrl: './planning.component.scss',
    imports: [PlanComponent, MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, DecimalPipe, MonthSelectorComponent],
    template: `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@200&icon_names=balance,payments" />
        
        <h2 class="title">PLANEJAMENTO</h2>

        <div class="add" (click)="this.router.navigate(['home/planning/new'])">
            <mat-icon>add</mat-icon>
        </div>

        <month-selector/>

        <div class="remaining">
            <h2>RESTAM</h2>
            <h1>{{ remaining() | currency:account()?.currency}}</h1>
        </div>

        <div class="TWOxTWO">
            <div class="small-box gains">
                <h2>RECEITAS</h2>
                <div><h1>{{revenues() | currency: account()?.currency}}</h1>
                <mat-icon>forward</mat-icon></div>
            </div>
            <div class="small-box losts">
                <h2>GASTOS PLANEJADOS</h2>
                <div><h1>{{expenses() | currency: account()?.currency}}</h1>
                <mat-icon>forward</mat-icon></div>
            </div>
            <div class="small-box balance">
                <h2>BALANÇO PLANEJADO</h2>
                <div><h1>{{balance() | currency: account()?.currency}}</h1>
                <span class="material-symbols-outlined">balance</span></div>
            </div>
            <div class="small-box economy">
                <h2>ECONOMIA PLANEJADA</h2>
                <div><h1>{{economy() | number:'1.2-2'}}%</h1>
                <span class="material-symbols-outlined">payments</span></div>
            </div>
        </div>

        <div class="classification-section">
            <h2 class="classification-title">CLASSIFICAÇÃO DE DESPESAS</h2>
            <div class="classification-grid">
                <div class="small-box classification fixed-expenses">
                    <h2>Despesas Fixas</h2>
                    <div><h1>{{fixedTotal() | currency: account()?.currency}}</h1></div>
                </div>
                <div class="small-box classification installment-expenses">
                    <h2>Parcelas</h2>
                    <div><h1>{{installmentTotal() | currency: account()?.currency}}</h1></div>
                </div>
                <div class="small-box classification variable-expenses">
                    <h2>Variáveis</h2>
                    <div><h1>{{variableTotal() | currency: account()?.currency}}</h1></div>
                </div>
            </div>
        </div>

        <div class="box">
            @for (plan of plannings(); track $index) {
                <plan [plan]="plan"/>
            }
        </div>
    `
})
export class PlanningComponent {
    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()
    private planningService = inject(PlanningService)
    readonly plannings = this.planningService.getPlanningsSignal()
    protected router = inject(Router)

    protected revenues = computed(() =>
        this.plannings().reduce((sum, p) => sum + (p.incomes?.reduce((s, i) => s + Number(i.value), 0) || 0), 0)
    );

    protected expenses = computed(() =>
        this.plannings().reduce((sum, p) => sum + (p.expenses?.reduce((s, e) => s + Number(e.monthlyValue), 0) || 0), 0)
    );

    protected remaining = computed(() =>
        this.plannings().reduce((sum, p) => sum + Number(p.availableLimit), 0)
    );

    protected balance = computed(() =>
        this.revenues() - this.expenses()
    );

    protected economy = computed(() =>
        this.revenues() > 0 ? ((this.revenues() - this.expenses()) / this.revenues()) * 100 : 0
    );

    protected fixedTotal = computed(() =>
        this.plannings().reduce((sum, p) =>
            sum + (p.expenses?.filter(e => e.type === 'fixed').reduce((s, e) => s + Number(e.monthlyValue), 0) || 0), 0)
    );

    protected installmentTotal = computed(() =>
        this.plannings().reduce((sum, p) =>
            sum + (p.expenses?.filter(e => e.type === 'installment').reduce((s, e) => s + Number(e.monthlyValue), 0) || 0), 0)
    );

    protected variableTotal = computed(() =>
        this.plannings().reduce((sum, p) =>
            sum + (p.expenses?.filter(e => e.type === 'variable').reduce((s, e) => s + Number(e.monthlyValue), 0) || 0), 0)
    );
}
