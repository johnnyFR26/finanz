import { Component, computed, input, output, Signal, signal} from '@angular/core';
import { FormsModule } from '@angular/forms'


@Component({
    selector: 'date-input',
    imports: [FormsModule],
    styleUrl: './date-input.component.scss',
    template: `
      <input
        #dayInput
        type="text"
        [(ngModel)]="day"
        maxlength="2"
        placeholder="DD"
        [disabled]="!disable()"
        (input)="onlyNumber(dayInput); this.emitDate(); onInput(dayInput, monthInput, 2, 31, 'day')"
      />
      <span class="bar">/</span>
      <input
        #monthInput
        type="text"
        [(ngModel)]="month"
        maxlength="2"
        placeholder="MM"
        [disabled]="!disable()"
        (input)="onlyNumber(monthInput); this.emitDate(); onInput(monthInput, yearInput, 2, 12, 'month')"
        (keydown)="onBackspace($event, monthInput, dayInput)"
      />
      <span class="bar">/</span>
      <input
        #yearInput
        type="text"
        [(ngModel)]="year"
        maxlength="4"
        placeholder="YYYY"
        class="year"
        [disabled]="!disable()"
        (input)="onlyNumber(yearInput); this.emitDate();"
        (keydown)="onBackspace($event, yearInput, monthInput)"
      />
    `
})

export class DateInputComponent{
  protected day = signal<string>("");
  protected month = signal<string>("");
  protected year = signal<string>("");

  readonly disable = input.required<boolean>();

  protected date = {
    day: this.day(),
    month: this.month(),
    year: this.year(),
  };
  protected dateOutput = output<object>()
  

  onlyNumber(input: HTMLInputElement){
    input.value = input.value.replace(/\D/g, '')
  }

  onInput(current: HTMLInputElement, next: HTMLInputElement, maxLength: number, max: number, model: 'day'|'month') {
    if (current.value.length >= maxLength) {
      let value = parseInt(current.value)

      if (value > max){
        value = max
      }
      else if (value <= 0){
        value = 1
      }

      current.value = value.toString();
      
      (this as any)[model].set(current.value);
      next.focus();
    }
  }

  onBackspace(event: KeyboardEvent, current: HTMLInputElement, prev: HTMLInputElement) {
    if (event.key === 'Backspace' && current.value.length === 0) {
      prev.focus();
    }
  }

  constructor(){
    this.emitDate();
  }

  emitDate(){
    this.dateOutput.emit(this.date);
  }
}