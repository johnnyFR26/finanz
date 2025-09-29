import { AccountService } from './../../services/account.service';
import { MatIcon } from '@angular/material/icon';
import { Component, computed, inject, input, signal } from "@angular/core";
import { CurrencyPipe, NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'plan',
    styleUrl: './plan.component.scss',
    imports: [MatIcon, MatButtonModule, MatProgressBarModule, CurrencyPipe, NgStyle],
    template: `
        <div class="box plan">
            <span class="top">
                <div class="category">
                    <mat-icon class="category-icon">restaurant</mat-icon>
                    <span>{{plan().title}}</span>
                </div>
                <div class="tools">
                    @if(!showDetails()){
                        <button mat-icon-button aria-label="descricao" (click)="showDetails.set(true)"><mat-icon>visibility</mat-icon></button>
                    }@else {
                        <button mat-icon-button aria-label="descricao" (click)="showDetails.set(false)"><mat-icon>visibility_off</mat-icon></button>
                    }
                    <button mat-icon-button aria-label="editar"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button aria-label="deletar"><mat-icon>delete</mat-icon></button>
                </div>
            </span>
            
            <div class="division">
                <div><span>META</span>{{plan().limit | currency: account()?.currency}}</div>
                <div><span>GASTO</span>{{totalSpent() | currency: account()?.currency}}</div>
                <div><span>DISPONÍVEL</span>{{plan().availableLimit | currency: account()?.currency}}</div>
            </div>
            
            <div class="progress-container">
                <div class="main-progress-bar">
                    @for (category of plan().planningCategories; track $index) {
                        <div 
                            class="category-segment"
                            [ngStyle]="{
                                'left.%': getCategoryPosition($index),
                                'width.%': getCategoryWeight(category),
                                'background-color': getCategoryColor(category, 0.3)
                            }">
                            <div 
                                class="category-progress"
                                [ngStyle]="{
                                    'width.%': getCategoryProgress(category),
                                    'background-color': getCategoryColor(category, 1)
                                }">
                            </div>
                            <!-- Tooltip com informações da categoria -->
                            <div class="category-tooltip">
                                <mat-icon>{{category.category.controls?.icon || 'category'}}</mat-icon>
                                <span>{{category.category.name}}</span>
                                <span class="progress-text">{{getCategoryProgress(category).toFixed(0)}}%</span>
                            </div>
                        </div>
                    }
                </div>
                
                <div class="categories-legend">
                    @for (category of plan().planningCategories; track $index) {                     
                        <div 
                            class="legend-item">
                            <div 
                                class="legend-color"
                                [ngStyle]="{'background-color': getCategoryColor(category, 1)}">
                            </div>
                            <span class="legend-text">
                                {{category.category.name}} 
                                ({{getCategoryWeight(category).toFixed(0)}}%)
                            </span>
                        </div>
                    }
                </div>
            </div>
            
            <div class="overall-progress">
                <span class="progress-label">
                    Progresso Geral: {{overallProgress().toFixed(1)}}%
                </span>
            </div>
            
            @if (showDetails()) {
                <div class="categories-detail">
                    @for (category of plan().planningCategories; track $index) {                    
                        <div 
                            class="category-detail">
                            <div class="category-header">
                                <mat-icon>{{category.category.controls?.icon || 'category'}}</mat-icon>
                                <span class="category-name">{{category.category.name}}</span>
                                <span class="category-percentage">{{getCategoryProgress(category).toFixed(0)}}%</span>
                            </div>
                            <mat-progress-bar 
                                mode="determinate" 
                                [value]="getCategoryProgress(category)"
                                [color]="'primary'">
                            </mat-progress-bar>
                            <div class="category-amounts">
                                <span>Gasto: {{getCategorySpent(category) | currency: account()?.currency}}</span>
                                <span>Disponível: {{category.availableLimit | currency: account()?.currency}}</span>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    `
})
export class PlanComponent {
    readonly accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()
    
    public plan = input<any>()
    public showDetails = signal(false)
    
    protected missing = computed(() => this.plan().limit - this.plan().availableLimit);
    protected percentage = computed(() => this.missing() / this.plan().limit);
    
    protected totalSpent = computed(() => {
        return this.plan().planningCategories?.reduce((total: number, category: any) => {
            return total + (parseFloat(category.limit) - parseFloat(category.availableLimit));
        }, 0) || 0;
    });
    
    protected overallProgress = computed(() => {
        const totalLimit = parseFloat(this.plan().limit);
        const spent = this.totalSpent();
        return (spent / totalLimit) * 100;
    });
    
    protected getCategoryWeight(category: any): number {
        const categoryLimit = parseFloat(category.limit);
        const totalLimit = parseFloat(this.plan().limit);
        return (categoryLimit / totalLimit) * 100;
    }
    
    protected getCategoryProgress(category: any): number {
        const categoryLimit = parseFloat(category.limit);
        const categoryAvailable = parseFloat(category.availableLimit);
        const spent = categoryLimit - categoryAvailable;
        return (spent / categoryLimit) * 100;
    }
    
    protected getCategorySpent(category: any): number {
        return parseFloat(category.limit) - parseFloat(category.availableLimit);
    }
    
    protected getCategoryPosition(index: number): number {
        return this.plan().planningCategories
            ?.slice(0, index)
            .reduce((acc: number, cat: any) => acc + this.getCategoryWeight(cat), 0) || 0;
    }
    
    protected getCategoryColor(category: any, opacity: number = 1): string {
        const colors = [
            '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
            '#F44336', '#00BCD4', '#8BC34A', '#FFC107',
            '#3F51B5', '#E91E63', '#009688', '#795548'
        ];
        
        const hash = category.category.name
            .split('')
            .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        
        const colorIndex = hash % colors.length;
        const color = colors[colorIndex];
        
        if (opacity < 1) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        
        return color;
    }
}