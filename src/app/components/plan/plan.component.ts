import { AccountService } from './../../services/account.service';
import { MatIcon } from '@angular/material/icon';
import { Component, computed, inject, input } from "@angular/core";
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
                    <span>{{plan().title}}</span>
                </div>
                <div class="tools">
                    <button mat-icon-button aria-label="editar"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button aria-label="deletar"><mat-icon>delete</mat-icon></button>
                </div>
            </span>
            <div class="division">
                <div><span>META</span>{{plan().limit| currency: account()?.currency}}</div>

                <div><span>TOTAL</span>{{missing()| currency: account()?.currency}}</div>
            </div>
            <mat-progress-bar mode="determinate" [value]="missing()" [attr.data]="percentage()"></mat-progress-bar>
            <span>RESTAM {{plan().available| currency: account()?.currency}}</span>
        </div>
    `
})
export class PlanComponent {
    readonly accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()

    public plan = input<any>()
    
    protected missing = computed(() => this.plan().limit - this.plan().availableLimit);
    protected percentage = computed(() => this.missing() / this.plan().limit);
}