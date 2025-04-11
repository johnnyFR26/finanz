import { Router } from '@angular/router'
import { Component, inject } from '@angular/core'
import { ToolBarComponent } from '../../components/toolbar/tool-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { UserService } from '../../services/user.service'
import { AccountService } from '../../services/account.service'

import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-home',
  imports: [ToolBarComponent, MatSidenavModule, MatListModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  userService = inject(UserService)
  private accountService = inject(AccountService)

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
