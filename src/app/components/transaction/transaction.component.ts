import { Component, inject, input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'transaction',
    imports: [MatIconModule, MatExpansionModule, DatePipe, CurrencyPipe],
    styleUrl: './transaction.component.scss',
    template: `
    <hr>
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
    <mat-expansion-panel-header>
      <mat-panel-title> <button mat-fab><mat-icon>check_circle</mat-icon></button> </mat-panel-title>
      <mat-panel-description>
        <div>
        <span class="date">{{transaction().createdAt | date: "dd/MM/YYYY"}}</span>
        <h1>{{transaction().value | currency:"BRL"}}</h1>
        </div>
        {{panelOpenState() ? 'aberto' : 'fechado'}}
      </mat-panel-description>
    </mat-expansion-panel-header>
    <p>{{transaction()?.description}}</p>
  </mat-expansion-panel>
    `
})

export class TransactionComponent implements OnInit{
  readonly panelOpenState = signal(false);
  readonly transaction = input<any>();
  
  ngOnInit(): void {
      console.log(this.transaction())
  }
}