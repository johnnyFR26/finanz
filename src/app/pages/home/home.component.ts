import { Component, inject } from '@angular/core';
import { ToolBarComponent } from '../../components/toolbar/tool-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [ToolBarComponent, MatSidenavModule, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  userService = inject(UserService)

  user = this.userService.getUserInfo()

}
