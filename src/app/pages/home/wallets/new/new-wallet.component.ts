import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { provideNativeDateAdapter, MatOption } from "@angular/material/core";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CreditCardService } from "../../../../services/credit-card.service";
import { AccountService } from "../../../../services/account.service";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from "ngx-otp-input";

export type day = "01" | "02" | undefined
export type month = "01" | "02" | undefined
export type year = "01" | "02" | undefined

@Component({
    selector: "app-new-wallet",
    styleUrls: ["./new-wallet.component.scss"],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIcon, MatOption, MatSelect, NgxOtpInputComponent],
    providers: [provideNativeDateAdapter()],
    template: `
    <button class="back" mat-icon-button (click)="this.router.navigate(['/home/wallets'])"><mat-icon>keyboard_backspace</mat-icon></button>
    <div class="box">
        <h2>Criar Carteira de Investimentos nova</h2>
        <div class="titleInput">
            <label for="name">Título:</label>
            <input class="input" type="text" id="name" name="name" [(ngModel)]="name" required>
        </div>
        
        <div>
            <label>ícone:</label>
            <div class="select-icon">
                <mat-select name="icon" [(ngModel)]="icon">
                    @for (icon of icons; track $index) {
                    <mat-option value="{{icon}}"><mat-icon>{{icon}}</mat-icon></mat-option>
                    }
                </mat-select>
                <mat-icon class="icon">{{icon()}}</mat-icon>
            </div>
        </div>

        <div class="radios">
            <input type="radio" name="type" id="daily">
            <label for="daily">
                Rendimento diário
                <mat-icon>calendar_today</mat-icon>

            </label>
            <input type="radio" name="type" id="monthly">
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
        <div class="check">
            <label for="compound">Rendimento sobre rendimento</label>
            <label for="compound">
                <input type="checkbox" id="compound" name="compound" [(ngModel)]="compound" placeholder="Data de Encerramento" required>
                <span></span>
            </label>
        </div>
        <div style="width:100%;">
            <div class="check">
                <label for="closingDate">Data Limite do investimento</label>
                <label for="closingDate">
                    <input type="checkbox" id="closingDate" name="closingDate" [(ngModel)]="closingDate" placeholder="Data de Encerramento" required>
                    <span></span>
                </label>
            </div>
            <div>
                <ngx-otp-input [options]="{otpLength:3}">

                </ngx-otp-input>
            </div>
        </div>
        

        <button class="button" (onClick)="onSubmit()">Salvar</button>
    </div>
    `
})
export class NewWalletComponent {
    private creditCardService = inject(CreditCardService)
    protected name = signal('')
    protected availableLimit = signal<number>(0.00)
    protected percent = signal<number>(0.00)
    protected company = signal('')
    protected closingDate = signal<{month: number, day: number}>({month: 1, day: 1})
    protected compound = signal<{month: number, day: number}>({month: 1, day: 1})
    protected paymentDate = signal<{month: number, day: number}>({month: 1, day: 1})
    protected router = inject(Router)
    
    public icon = signal('')
    public icons = [
      'account_balance',
      'savings',
      'shopping_cart',
      'payment',
      'credit_card',
      'attach_money'
    ]


    public dates = [
        {
            day: <day> undefined
        },
        {
            month: <month> undefined
        },
        {
            year: <year> undefined
        }
    ]
    
    // Valores auxiliares para o datepicker
    protected closingDateValue = signal<Date | null>(null)
    protected paymentDateValue = signal<Date | null>(null)
    
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()

    private formValue = computed(() => {
        return {
            name: this.name(),
            availableLimit: this.availableLimit(),
            limit: this.percent(),
            company: this.company(),
            close: this.closingDate(),
            expire: this.paymentDate(),
            accountId: this.account()?.id
        }
    })


    onSubmit() {
        console.log(this.formValue())
        //@ts-expect-error
        this.creditCardService.createCreditCard(this.formValue())
        this.router.navigate(['/home/creditCard'])
    }
}