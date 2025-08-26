import { Component} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'month-selector',
    imports: [MatIconModule, MatIconButton],
    styleUrl: './month-selector.component.scss',
    template: `
      <div class="month-selector">
          <button mat-icon-button (click)="subMonth()"><mat-icon>keyboard_arrow_left</mat-icon></button>
          <div class="mini-box">{{months[monthNumber]}}</div>
          <button mat-icon-button (click)="addMonth()"><mat-icon>keyboard_arrow_right</mat-icon></button>
      </div>
    `
})

export class MonthSelectorComponent{
  readonly months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  protected monthNumber = new Date().getMonth();
  addMonth(){
    if(this.monthNumber<11)
      this.monthNumber += 1;
  }
  subMonth(){
    if(this.monthNumber>0)
      this.monthNumber -= 1;
  }
}