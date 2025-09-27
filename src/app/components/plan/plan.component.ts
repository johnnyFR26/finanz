import { AccountService } from './../../services/account.service';
import { MatIcon } from '@angular/material/icon';
import { Component, inject, input } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'plan',
    styleUrl: './plan.component.scss',
    imports: [MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe],
    template: `
        <div class="box plan">
            <span class="top">
                <div class="category">
                    <mat-icon class="category-icon">restaurant</mat-icon>
                    <span>ALIMENTAÇÃO</span>
                </div>
                <div class="tools">
                    <button mat-icon-button aria-label="editar"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button aria-label="deletar"><mat-icon>delete</mat-icon></button>
                </div>
            </span>
            <div class="division">
                <div><span>META</span>{{plan().limit| currency: account()?.currency}}</div>
                <div><span>PAGO</span>{{paid| currency: account()?.currency}}</div>
                <div><span>PREVISTO</span>{{predicted| currency: account()?.currency}}</div>
                <div><span>TOTAL</span>{{missing| currency: account()?.currency}}</div>
            </div>
            <mat-progress-bar mode="determinate" [value]="percentage" [attr.data]="percentage"></mat-progress-bar>
            <span>RESTAM {{plan().available| currency: account()?.currency}}</span>
        </div>
    `
})
export class PlanComponent {
    readonly accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()

    public plan = input<any>()
    
    protected paid = 150;
    protected predicted = 200;
    protected missing = this.plan().limit - this.plan().available;
    protected percentage = this.missing / this.plan().limit;
}