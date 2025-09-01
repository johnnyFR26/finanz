import { Component, computed, ElementRef, inject, signal, ViewChild, AfterViewInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router'
import { EMAIL_REGEXP } from '../../utils/email-validator'
import {
  MatSnackBar,
} from '@angular/material/snack-bar'
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { AccountService } from '../../services/account.service'
import { CategoryService } from '../../services/category.service'
import * as anime from 'animejs';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, MatIconModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent implements AfterViewInit {
  goTo(path: string) {
    if (document.startViewTransition) {
      document.startViewTransition( async () => {
        this.router.navigate([path]);
      });
    } else {
      this.router.navigate([path]);
    }
  }

  protected userService = inject(UserService)
  protected authService = inject(AuthService)
  private accountService = inject(AccountService)
  private categoryService = inject(CategoryService)
  private router = inject(Router)
  private el = inject(ElementRef)
  public showPassword = true


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
          { to: [1, 10] },
          { to: 1 }
        ],
        boxShadow: [
          { to: '0 0 1rem 0 currentColor' },
          { to: '0 0 0rem 0 currentColor' }
        ],
        delay: anime.stagger(100, {
          grid: [cols, rows],
          from: anime.utils.random(0, cols * rows)
        }),
        onComplete: animateGrid
      });
    };

    animateGrid();
  }

  calculateGrid() {
    const containerEl = this.container.nativeElement as HTMLElement;

    const squareSize = 40;
    
    const numCols = Math.floor(containerEl.clientWidth / squareSize);
    const numRows = Math.floor(containerEl.clientHeight / squareSize);

    this.rows = Array.from({ length: numRows });
    this.cols = Array.from({ length: numCols });
  }

   togglePassword() {
    this.showPassword = !this.showPassword
  }

  public email = signal<string>('')
  public password = signal<string>('')

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
          if(response.user.account){
            this.categoryService.setCategories(response.user.account.categories)
          }

          this.router.navigateByUrl('/home/account')

          if(response.user.account != null){
            this.accountService.setCurrentAccount({
              currentValue: response.user.account.currentValue,
              currency: response.user.account.currency,
              id: response.user.account.id
            })
        }else{
          console.log("Usuário não possui conta")
        }

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
