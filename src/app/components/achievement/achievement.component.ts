import { MatIcon } from '@angular/material/icon';
import { Component, computed, inject, input } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'achievement',
    imports: [MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, CommonModule],
    styleUrl: './achievement.component.scss',
    template: `
      <div class="box card" [ngClass]="percentage() >= 100 ? 'completed' : 'uncompleted'">
        <div class="name">
            <mat-icon [ngClass]="percentage() >= 100 ? 'completed' : 'uncompleted'">attach_money</mat-icon>
            <div>
                <h3>{{ achievement().name}}</h3>
                <p>{{achievement().description}} {{achievement().goal | currency:'BRL'}}</p>
            </div>
        </div>
        <mat-progress-bar mode="determinate" [value]="percentage()" [attr.data]="percentage()"></mat-progress-bar>

        <div class="current">
            <span>{{achievement().current| currency:account()?.currency}}</span>
            <span>{{achievement().goal| currency:account()?.currency}}</span>
        </div>
      </div>
    `
})

export class AchievementComponent{
    protected percentage = computed((): number => Number((this.achievement().current / this.achievement().goal *100).toFixed(2)));
    protected date = new Date();

    private accountService = inject(AccountService)
    readonly account = this.accountService.getCurrentAccount()

    public achievement = input({
        name: 'Achievement',
        description: 'Save 100$',
        goal: 100,
        current: 100,
    })
}