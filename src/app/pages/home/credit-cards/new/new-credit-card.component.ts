import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CreditCardService } from "../../../../services/credit-card.service";
import { AccountService } from "../../../../services/account.service";

@Component({
    selector: "app-new-credit-card",
    styleUrls: ["./new-credit-card.component.scss"],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
    providers: [provideNativeDateAdapter()],
    template: `
    <div class="new-credit-card">
        <h1>new credit card</h1>
        <form name="form" (ngSubmit)="onSubmit()">
            <label for="name">Nome do Cartão</label>
            <input class="input" type="text" id="name" name="name" [(ngModel)]="name" placeholder="Nome do Cartão" required>

            <label for="availableLimit">Limite Disponível</label>
            <input class="input" type="number" id="availableLimit" [(ngModel)]="availableLimit" name="availableLimit" placeholder="Limite Disponível" required>

            <label for="limit">Limite Total</label>
            <input class="input" type="number" id="limit" name="limit" [(ngModel)]="limit" placeholder="Limite Total" required>

            <label for="company">Empresa</label>
            <input class="input" type="text" id="company" name="company" [(ngModel)]="company" placeholder="Empresa" required>

            <label for="closingDate">Data de Encerramento</label>
            <input class="input" type="number" id="closingDate" name="closingDate" [(ngModel)]="closingDate" placeholder="Data de Encerramento" required>

            <label for="paymentDate">Data de Pagamento</label>
            <input class="input" type="number" id="paymentDate" name="paymentDate" [(ngModel)]="paymentDate" placeholder="Data de Pagamento" required>

            

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
    
    // Valores auxiliares para o datepicker
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
            accountId: this.account()?.id
        }
    })


    onSubmit() {
        console.log(this.formValue())
        //@ts-expect-error
        this.creditCardService.createCreditCard(this.formValue())
    }
}