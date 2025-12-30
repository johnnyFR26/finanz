import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { provideNativeDateAdapter} from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CreditCardService } from "../../../../services/credit-card.service";
import { AccountService } from "../../../../services/account.service";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

@Component({
    selector: "app-new-credit-card",
    styleUrls: ["./new-credit-card.component.scss"],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIcon, MatSelectModule],
    providers: [provideNativeDateAdapter()],
    template: `
    <div class="new-credit-card">
        <button class="back" mat-icon-button (click)="this.router.navigate(['/home/creditCard'])"><mat-icon>keyboard_backspace</mat-icon></button>
        <h2 class="title">NOVO CARTÃO DE CRÉDITO</h2>
        <form class="box" name="form" (ngSubmit)="onSubmit()">
            <div>
                <label for="name">Nome do Cartão</label>
                <input class="input" type="text" id="name" name="name" [(ngModel)]="name" placeholder="Nome do Cartão" required>
            </div>
            <div>
                <label for="company">Empresa</label>
                <mat-select class="input" id="company" name="company" [(ngModel)]="company" placeholder="Empresa" required>
                    @for (company of companies; track $index) {
                        <mat-option [value]="company"><img src="/credit-card/{{company}}.png">{{company}}</mat-option>
                    }
                </mat-select>
            </div>

            <div>
                <label for="availableLimit">Limite Disponível</label>
                <input class="input" type="number" id="availableLimit" [(ngModel)]="availableLimit" name="availableLimit" placeholder="Limite Disponível" required>
            </div>
            <div>
                <label for="limit">Limite Total</label>
                <input class="input" type="number" id="limit" name="limit" [(ngModel)]="limit" placeholder="Limite Total" required>
            </div>
            <div>
                <label for="closingDate">Data de Encerramento</label>
                <input class="input" type="number" id="closingDate" name="closingDate" [(ngModel)]="closingDate" placeholder="Data de Encerramento" required>
            </div>
            <div>
                <label for="paymentDate">Data de Pagamento</label>
                <input class="input" type="number" id="paymentDate" name="paymentDate" [(ngModel)]="paymentDate" placeholder="Data de Pagamento" required>
            </div>
            

            <button class="button" type="submit">Salvar</button>
        </form>
    </div>
    `
})
export class NewCreditCardComponent {
    private creditCardService = inject(CreditCardService)
    protected name = signal('')
    protected availableLimit = signal<number>(0.00)
    protected limit = signal<number>(0.00)
    protected company = signal('')
    protected closingDate = signal<{month: number, day: number}>({month: 1, day: 1})
    protected paymentDate = signal<{month: number, day: number}>({month: 1, day: 1})
    protected router = inject(Router)

    readonly companies = [
        "Alelo", "American Express", "Diners Club", "Elo", "Hipercard", "Maestro", "Mastercard", "Visa"
    ]
    
    protected closingDateValue = signal<Date | null>(null)
    protected paymentDateValue = signal<Date | null>(null)
    
    private accountService = inject(AccountService)
    private account = this.accountService.getCurrentAccount()

    private formValue = computed(() => {
        return {
            name: this.name(),
            availableLimit: this.availableLimit(),
            limit: this.limit(),
            company: this.company(),
            close: this.closingDate(),
            expire: this.paymentDate(),
            accountId: this.account()?.id ?? ''
        }
    })


    onSubmit() {
        console.log(this.formValue())
        //@ts-expect-error vou investigar ainda
        this.creditCardService.createCreditCard(this.formValue())
        this.router.navigate(['/home/creditCard'])
    }
}