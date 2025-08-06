import { MatIcon } from '@angular/material/icon';
import { Component } from "@angular/core";
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
                <div><span>META</span>{{goal| currency: 'BRL'}}</div>
                <div><span>PAGO</span>{{paid| currency: 'BRL'}}</div>
                <div><span>PREVISTO</span>{{predicted| currency: 'BRL'}}</div>
                <div><span>TOTAL</span>{{total| currency: 'BRL'}}</div>
            </div>
            <mat-progress-bar mode="determinate" [value]="percentage" [attr.data]="percentage"></mat-progress-bar>
            <span>RESTAM {{missing| currency: 'BRL'}}</span>
        </div>
    `
})
export class PlanComponent {
    protected goal = 400;
    protected paid = 150;
    protected predicted = 200;
    protected total = 150;
    protected percentage = 37;
    protected missing = this.goal - this.paid;
}