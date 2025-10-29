import { Component, computed, output, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'date-input',
    imports: [FormsModule],
    styleUrl: './date-input.component.scss',
    template: `
      <input type="number" [disabled]="!isLenght()" [(ngModel)]="day" max="31" placeholder="DD"/>
      <span class="bar">/</span>
      <input type="number" maxlength="2" placeholder="MM"/>
      <span class="bar">/</span>
      <input class="year" type="number" maxlength="2" placeholder="YYYY"/>
    `
})

export class DateInputComponent{
  protected monthNumber = new Date().getMonth();
  protected month = output<number>()

  public day = signal<string>("")

  public isLenght = computed(() => {
    return  this.day().length >= 2
  })

  constructor(){
    this.updateMonth();
  }

  addMonth(){
    if(this.monthNumber<11){
      this.monthNumber += 1;
      this.updateMonth();
    }
  }
  subMonth(){
    if(this.monthNumber>0){
      this.monthNumber -= 1;
      this.updateMonth();
  }
}

  updateMonth(){
    this.month.emit(this.monthNumber);
  }
}