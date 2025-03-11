import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../../services/account.service";

@Component({
    selector: 'app-create-account',
    template: `
    <div class="create-account">
        <div class="create-account__container">
            <h1 class="create-account__title">Criar conta</h1>
            <form (ngSubmit)="onSubmit()" class="create-account__form">
                <input [(ngModel)]="currentValue" [ngModelOptions]="{standalone: true}" type="number" placeholder="Valor inicial" class="create-account__input">
                <button type="submit" class="create-account__button">Criar conta</button>
            </form>
        </div>
    `,
    styles: `
        input, button {
            color: #000;
            padding: 5px;
        }
    `,
    imports: [FormsModule]
})
export class CreateAccountComponent {

    protected currentValue = signal<number>(0.00)
    private fixedCurrency = signal<string>('BR')
    private accountService = inject(AccountService)

    public formValue = computed(() => {
        return {
            currentValue: this.currentValue(),
            currency: this.fixedCurrency()
        }
    })

    onSubmit(){
        console.log('Form Value:', this.formValue())
        this.accountService.createAccount(this.formValue())
    }
}