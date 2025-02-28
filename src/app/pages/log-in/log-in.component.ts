import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  private userService = inject(UserService)
  private router = inject(Router)

  public email = signal<string>('')
  public password = signal<string>('')

  public formValue = computed(() => {
    return {
      email: this.email(),
      password: this.password(),
    };
  });

  public isFormValid = computed(() => {
    const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return this.email().length > 0 && this.password().length > 0 && EMAIL_REGEXP.test(this.email());
  });

  onSubmit(){
    console.log('Form Value:', this.formValue())

    this.userService.loginUser(this.formValue()).subscribe((response) => {
      console.log('Response:', response)

      if(!response.token){ 
        return console.log("DEU MERDA")
      }

      this.userService.setCurrentUser({
        token: response.token,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email
        }
      })

      this.router.navigateByUrl('/home')
    })

  }

}
