import { Router } from '@angular/router'
import { Component, inject, OnInit } from '@angular/core'
import { ToolBarComponent } from '../../components/toolbar/tool-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { UserService } from '../../services/user.service'
import { AccountService } from '../../services/account.service'

import { RouterOutlet } from '@angular/router'
import { TransactionService } from '../../services/transaction.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [ToolBarComponent, MatSidenavModule, MatListModule, RouterOutlet, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.transactionService.getAccountTransactions(this.account()!.id)
  }

  userService = inject(UserService)
  private accountService = inject(AccountService)
  private transactionService = inject(TransactionService)
  private account = this.accountService.getCurrentAccount()

  user = this.userService.getUserInfo()
  router = inject(Router)

  public redirectToPath(route: string){
    if(route == '/login'){
      this.userService.setCurrentUser(null)
      this.accountService.setCurrentAccount(null)
    }
    this.router.navigate([route])
  }

}
