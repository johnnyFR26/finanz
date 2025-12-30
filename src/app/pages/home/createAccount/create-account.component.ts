import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "../../../services/account.service";
import { MatSelectModule } from "@angular/material/select";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'app-create-account',
    styleUrls: ["./create-account.component.scss"],
    template: `
        <form (ngSubmit)="onSubmit()" class="small-box">
            <section class="initialMessage">
                <h1>Bem vindo {{ user()?.user?.name?.split(" ")?.slice(0, 2)?.join(' ') ?? ""}}</h1>
                <h2>Para iniciarmos a gerir seus gastos, vamos criar a sua conta Finanz:</h2>
            </section>
            <section>
                <label for="initialValue">Valor inicial</label>
                <input [(ngModel)]="currentValue" id="initialValue" [ngModelOptions]="{standalone: true}" type="number" placeholder="Valor inicial" class="input">
            </section>
            <section>
                <label for="Currency">Moeda</label>
                <mat-select [(ngModel)]="fixedCurrency" id="Currency" class="input">
                    <mat-option value="BRL">Real (BRL)</mat-option>
                    <mat-option value="USD">Dólar Americano (USD)</mat-option>
                </mat-select>
            </section>
            <button type="submit" class="button">Criar conta</button>
        </form>
    `,
    imports: [FormsModule, MatSelectModule]
})
export class CreateAccountComponent {

    protected currentValue = signal<number>(0.00)
    protected fixedCurrency = signal<string>('BRL')
    private accountService = inject(AccountService)
    protected account = this.accountService.getCurrentAccount()
    protected userService = inject(UserService)
    readonly user = this.userService.getUserInfo();

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