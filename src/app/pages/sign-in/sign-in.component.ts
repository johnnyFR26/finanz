import { Component, computed, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import * as anime from 'animejs';
import { EMAIL_REGEXP } from '../../utils/email-validator';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private router = inject(Router)

  goTo(path: string) {
    if (document.startViewTransition) {
      document.startViewTransition( async () => {
        this.router.navigate([path]);
      });
    } else {
      this.router.navigate([path]);
    }
  }

  rows: number[] = [];
  cols: number[] = [];

   @ViewChild('container', { static: true }) container!: ElementRef;

  ngAfterViewInit(): void {
    this.calculateGrid();

    if(this.rows.length != 0){
      setTimeout(() => {
        this.animationGrid();
      });
    }
  }

  animationGrid() {
  const $element = anime.utils.$('.element');
  
      const rows = this.rows.length;
      const cols = this.cols.length;
  
      const animateGrid = () => {
        anime.animate($element, {
          scale: [
            {to: [1, 0.1]},
            {to: 1}
          ],
          transform: [
            {to: ['rotate3d(0, 0, 0, 0deg) scale(1)',
              'rotate3d(' + anime.utils.random(0.5,1) + 
              ', ' + anime.utils.random(0.5,1) +
              ', ' + anime.utils.random(0.5,1) +
              ', ' + anime.utils.random(200,1000) + 
              'deg) scale(0.1)']},
            {to: 'rotate3d(0, 0, 0, 0deg) scale(1)'},
          ],
          delay: anime.stagger(100, {
            grid: [cols, rows],
            from: anime.utils.random(0, cols * rows)
          }),
          duration: 10000,
          onComplete: animateGrid
        });
      };
  
      animateGrid();
    }
  
    calculateGrid() {
      const containerEl = this.container.nativeElement as HTMLElement;
  
      const squareSize = 32;
      
      const numCols = Math.floor(containerEl.clientWidth / squareSize);
      const numRows = Math.floor(containerEl.clientHeight / squareSize);
  
      this.rows = Array.from({ length: numRows });
      this.cols = Array.from({ length: numCols });
    }

  private userService = inject(UserService)

  public email = signal<string>('')
  public password = signal<string>('')
  public name = signal<string>('')
  public confirmPassword = signal<string>('')
  public phone = signal<string>('')
  public cpf = signal<string>('')

  public formValue = computed(() => {
    return {
      email: this.email(),
      password: this.password(),
      name: this.name(),
      confirmPassword: this.confirmPassword(),
      phone: this.phone(),
      cpf: this.cpf()
    };
  });

  public isFormValid = computed(() => {
    return this.email().length > 0 && this.password().length > 0 && this.name().length > 0 && this.confirmPassword().length > 0 && this.phone().length > 0 && this.cpf().length > 0 && this.password() === this.confirmPassword() && EMAIL_REGEXP.test(this.email());
  });

  public isPasswordValid = computed(() => {
    return this.password().length > 0 && this.password() === this.confirmPassword();
  })

  onSubmit(){
    console.log('Form Value:', this.formValue())

    this.userService.createUserObserVable(this.formValue())

    this.email.set('')
    this.password.set('')
    this.name.set('')
    this.confirmPassword.set('')
    this.phone.set('')
    this.cpf.set('')
    
  }
}
