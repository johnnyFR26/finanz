import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { provideNativeDateAdapter, MatOption } from "@angular/material/core";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AccountService } from "../../../../services/account.service";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { DateInputComponent } from "../../../../components/date-input/date-input.component";
import { WalletsService } from "../../../../services/wallets.service";
import { type } from "../../../../models/moviment.model";
import { CreateHoldingDto } from "../../../../models/holding.model";

@Component({
    selector: "app-new-wallet",
    styleUrls: ["./new-wallet.component.scss"],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIcon, MatOption, MatSelect, DateInputComponent],
    providers: [provideNativeDateAdapter()],
    template: `
    <button class="back" mat-icon-button (click)="this.router.navigate(['/home/wallets'])"><mat-icon>keyboard_backspace</mat-icon></button>
    <form class="box" name="form" (ngSubmit)="onSubmit()">
        <h2>Criar Carteira de Investimentos nova</h2>
        <div class="Input">
            <label for="name">Título:</label>
            <input class="input" type="text" id="name" name="name" [(ngModel)]="name" required>
        </div>
        
        <div class="Input">
            <label for="value">Valor inicial:</label>
            <input class="input" type="number" id="value" name="value" [(ngModel)]="value" required>
        </div>
        
        <div class="Input">
            <label for="description">Descrição:</label>
            <textarea class="input" id="description" name="description" [(ngModel)]="description" required></textarea>
        </div>
        
        <div>
            <label>ícone:</label>
            <div class="select-icon">
                <mat-select id="icon" name="icon" [(ngModel)]="icon">
                    @for (icon of icons; track $index) {
                    <mat-option value="{{icon}}"><mat-icon>{{icon}}</mat-icon></mat-option>
                    }
                </mat-select>
                <mat-icon class="icon">{{icon()}}</mat-icon>
            </div>
        </div>

        <div class="radios">
            <input type="radio" name="type" id="daily" value="daily" [(ngModel)]="type">
            <label for="daily">
                Rendimento diário
                <mat-icon>calendar_today</mat-icon>

            </label>
            <input type="radio" name="type" id="monthly" value="monthly" [(ngModel)]="type">
            <label for="monthly">
                Rendimento mensal
                <mat-icon>calendar_today</mat-icon>
            </label>
        </div>
        <div>
            <label for="percent">Porcentagem(%) do rendimento:</label>
            <div class = "percent">
                <input class="input" type="number" id="percent" name="percent" [(ngModel)]="percent">
                <mat-icon>percent</mat-icon>
            </div>
        </div>
        <div class="checks">
            <div class="check">
                <label for="compound">Rendimento sobre rendimento</label>
                <label for="compound">
                    <input type="checkbox" id="compound" name="compound" [(ngModel)]="compound">
                    <span></span>
                </label>
            </div>
            <div class="check">
                <label for="closingDate">Data Limite do investimento</label>
                <label for="closingDateCheckbox">
                    <input type="checkbox" id="closingDateCheckbox" name="closingDateCheckbox" [(ngModel)]="closingDateCheckbox">
                    <span></span>
                </label>
            </div>
            <div>
                <date-input [disable]="closingDateCheckbox()" (dateOutput)="updateDate($event)"/>
            </div>
        </div>
        

        <input class="button" type="submit" value="Salvar"/>
    </form>
    `
})
export class NewWalletComponent {
    private walletsService = inject(WalletsService)
    protected name = signal('')
    protected value = signal<number>(0)
    protected description = signal('')
    protected type = signal('')
    protected percent = signal<number>(0.00)
    protected closingDateCheckbox = signal<boolean>(false)
    protected closingDate = signal<Date>(new Date())
    protected compound = signal<boolean>(false)
    protected router = inject(Router)
    
    protected icon = signal('')
    public icons = [
      'account_balance',
      'savings',
      'shopping_cart',
      'payment',
      'credit_card',
      'attach_money'
    ]


    updateDate(date: Date){
        this.closingDate.set(date)
    }
    
    
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()
    
    
    private formValue = computed(() => {
        let dueDate = this.closingDateCheckbox() ? this.closingDate() : new Date(); 
        console.log(dueDate)
        return <CreateHoldingDto>{
            accountId: this.account()?.id,
            name: this.name(),
            tax: this.percent(),
            total: 0,
            dueDate: new Date(dueDate),
            controls:{
                icon: this.icon(),
                type: this.type(),
                description: this.description(),
                compound: this.compound(),
            },

        }
    })

    


    onSubmit() {
        console.log(this.formValue())
        this.walletsService.postHoldingRequest(this.formValue())

        let holdings = this.walletsService.getHoldings()
        let firstMoviment = computed(() => {
            return{
                value: this.value(),
                holdingId: holdings()[holdings.length - 1].id,
                type: <type>"input"
            }
        })
        this.walletsService.postMovimentRequest(firstMoviment())

        this.router.navigate(['/home/creditCard'])
    }
}