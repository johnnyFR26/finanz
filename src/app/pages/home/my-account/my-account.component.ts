import { Component, inject } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../../../services/user.service";
import { TransactionService } from "../../../services/transaction.service";
import { AchievementComponent } from "../../../components/achievement/achievement.component";
import { AchievementService } from "../../../services/achievement.service";

@Component({
    selector: 'my-account',
    template: `
    <div class="account-name">
      <div>
        <div class="account-photo">
          <mat-icon class="photo">account_circle</mat-icon>
          <button class="edit" mat-mini-fab><mat-icon>edit</mat-icon></button>
        </div>
        <h1>{{username}}</h1>
      </div>
      <span class="typePlan">Standart</span>
    </div>

    <div class="achievements">
      <h2>CONQUISTAS</h2>
      <div>
          @for (achievement of achievements(); track $index) {
            <achievement [achievement]="achievement"/>
          }
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
    imports: [MatIconModule, MatButtonModule, AchievementComponent]
})
export class MyAccountComponent{
    protected transactionService = inject(TransactionService)
    private accountService = inject(AccountService)
    private userService = inject(UserService)
    private achievementService = inject(AchievementService)
    protected user = this.userService.getUserInfo()
    protected account = this.accountService.getCurrentAccount()
    public id = this.account()?.id
    protected sum = this.transactionService.sum;
    protected sub = this.transactionService.sub;
    readonly username = this.user()?.user?.name;
    protected achievements = this.achievementService.getCurrentAchievements();
}