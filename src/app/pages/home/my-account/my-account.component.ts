import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../../services/user.service";
import { TransactionService } from "../../../services/transaction.service";
import { AchievementComponent } from "../../../components/achievement/achievement.component";

@Component({
    selector: 'my-account',
    template: `
    <div class="account-name">
      <div class="account-photo">
        <mat-icon class="photo">account_circle</mat-icon>
        <button class="edit" mat-mini-fab><mat-icon>edit</mat-icon></button>
      </div>
      <h1>{{username}}</h1>
      <span class="typePlan">Standart</span>
    </div>

    <div class="achievements">
      <h2>CONQUISTAS</h2>
      <div>
        <achievement [achievement]="achievement1"/>
        <achievement [achievement]="achievement2"/>
        <achievement [achievement]="achievement3"/>
        <achievement [achievement]="achievement4"/>
        <achievement [achievement]="achievement5"/>
        <achievement [achievement]="achievement6"/>
      </div>
    </div>

    <div class="account-config">
      <div class="box currency">
        <label labelfor="coin-select">Moeda</label>
        <select name="coin" id="coin-select">
          <option value="BRL">Brasil (R$)</option>
        </select>
        <label labelfor="appearence-select">Aparência</label>
        <select name="appearence" id="appearence-select">
          <option value="dark">Modo Escuro</option>
          <option value="light">Modo Claro</option>
          <option value="system">De Acordo Com o Sistema</option>
        </select>
      </div>

      <div class="box plan">
        <label>Seu Plano</label>
        <div>
          <mat-icon>stars</mat-icon>
          <div>
            Finanz
            <span class="typePlan">Standart</span>
          </div>
          <p>Você tem acesso apenas ao conteúdo do plano STANDART.<br>
          Descubra todas as vantagens do plano <span>PREMIUM</span> no botão a seguir</p>
        </div>
        <button mat-button> Seja Premium <mat-icon>stars</mat-icon></button>
      </div>
    </div>
    `,
    styleUrl: './my-account.component.scss',
    imports: [CurrencyPipe, MatIconModule, MatButtonModule, AchievementComponent]
})
export class MyAccountComponent implements OnInit{
    
    ngOnInit(): void {     
        console.table(this.account)
        console.log(this.sum())
    }
    protected transactionService = inject(TransactionService)
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()
    public id = this.account()?.id
    protected sum = this.transactionService.sum;
    protected sub = this.transactionService.sub;
    readonly username = this.user()?.user?.name;

    protected achievement1 = {
        name: 'Economizador I',
        description: 'Economize um total de ',
        goal: 100,
        current: 100,
    }
    protected achievement2 = {
        name: 'Economizador II',
        description: 'Economize um total de ',
        goal: 500,
        current: 100,
    }
    protected achievement3 = {
        name: 'Economizador III',
        description: 'Economize um total de ',
        goal: 1000,
        current: 100,
    }
    protected achievement4 = {
        name: 'Economizador IV',
        description: 'Economize um total de ',
        goal: 2000,
        current: 100,
    }
    protected achievement5 = {
        name: 'Economizador V',
        description: 'Economize um total de ',
        goal: 5000,
        current: 100,
    }
    protected achievement6 = {
        name: 'Economizador VI',
        description: 'Economize um total de ',
        goal: 10000,
        current: 100,
    }
}