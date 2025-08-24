import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
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
      document.startViewTransition(() => {
        this.router.navigate([path]);
      });
    } else {
      this.router.navigate([path]);
    }
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
