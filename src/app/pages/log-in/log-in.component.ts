import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { EMAIL_REGEXP } from '../../utils/email-validator';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

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

  private snackbarMessage: string = ''

  public formValue = computed(() => {
    return {
      email: this.email(),
      password: this.password(),
    };
  });

  public isFormValid = computed(() => {
   
    return this.email().length > 0 && this.password().length > 0 && EMAIL_REGEXP.test(this.email());
  });

  onSubmit(){
    console.log('Form Value:', this.formValue())

    this.userService.loginUser(this.formValue()).subscribe({
      next: (response) => {
        console.log('Response:', response);
    
        if (!response || response.error) { 
          
          console.log("DEU MERDA");
        } else {
          console.log("Login bem-sucedido!")

          this.userService.setCurrentUser({
            token: response.token,
            user: {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email
            }
          })
    
          this.router.navigateByUrl('/home')
        }
      },
      error: (err) => {
        console.error("Erro na requisição:", err.error);
        console.log("DEU MERDA");
        this.openSnackBar(err.error.error)
      }
    })

  }

  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      data: {message},
    });
  }



}
