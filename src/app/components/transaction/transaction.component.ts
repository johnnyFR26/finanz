import { Component, inject, input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'transaction',
    imports: [MatIconModule, MatExpansionModule, DatePipe],
    styleUrl: './transaction.component.scss',
    template: `
    <hr>
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
    <mat-expansion-panel-header>
      <mat-panel-title> <button mat-fab><mat-icon>check_circle</mat-icon></button> </mat-panel-title>
      <mat-panel-description>
        <div>
        <span>{{transaction()?.createdAt | date: "dd/MM/YYYY"}}</span>
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