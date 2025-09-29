import { Component, inject, input, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account.service';
import { TransactionModel } from '../../models/transaction.model';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionModalComponent } from '../../modals/edit-transactions/edit-transaction-modal.component';

@Component({
    selector: 'transaction',
    imports: [MatIconModule, MatButtonModule, MatExpansionModule, DatePipe, CurrencyPipe],
    styleUrl: './transaction.component.scss',
    template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <button mat-fab-button (click)="switchSelect()">
            <mat-icon style="color: var(--type);">
              @if(buttonSelected()){check_circle}
              @else {radio_button_unchecked}
            </mat-icon>
          </button>
        </mat-panel-title>
        <mat-panel-description>
          <div>
          <span class="date">{{transaction().createdAt | date: "dd/MM/yyyy"}}</span>
          <h1 [class]="transaction().type == 'output' ? 'saida' : 'entrada'">{{transaction().value | currency: account()?.currency}}</h1>
          </div>
          {{transaction()?.category?.name}} 
          @if (transaction().category?.controls?.icon) {
            <mat-icon class="category-icon" [style.background-color]="transaction().category.controls?.color">{{transaction().category?.controls?.icon}}</mat-icon>
          }
        </mat-panel-description>
      </mat-expansion-panel-header>
      @if(transaction().creditCard){
        <p>Cartão: {{transaction()?.creditCard?.name}}</p>
      }
      <p>{{transaction()?.description}}</p>
        <div class="tools">
          <button mat-icon-button aria-label="anexar">
            <mat-icon class="file">attach_file</mat-icon>
          </button>
        <button mat-icon-button aria-label="editar" (click)="openEditTransactionModal(this.transaction())">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button aria-label="deletar">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
    </mat-expansion-panel>
    `
})

export class TransactionComponent{
  readonly panelOpenState = signal(false);
  readonly transaction = input<any>();
  readonly buttonSelected = signal(true);
  private accountService = inject(AccountService);
  readonly dialog = inject(MatDialog);
  readonly account = this.accountService.getCurrentAccount()
  switchSelect() : void {
    if(this.buttonSelected() == true){
      this.buttonSelected.set(false);
    }
    else {
      this.buttonSelected.set(true)
    }
  };
  openEditTransactionModal(transaction: TransactionModel) : void{
    const dialogRef = this.dialog.open(EditTransactionModalComponent, {
          data: {
            transaction: transaction,
        },
        });
  }
}