import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userService =inject(UserService)
    private accountService = inject(AccountService)
    private googleProvider = new GoogleAuthProvider()
    private auth: Auth = inject(Auth)
    private http = inject(HttpClient)
    private router = inject(Router)
    private urlApi = environment.urlApi


    async loginWithGoogle() {
        try {
          const result = await signInWithPopup(this.auth, this.googleProvider)
          //@ts-ignore
          const { email, accessToken } = result.user
    
          console.log('Login com Google bem-sucedido:', email, accessToken);
          this.http.post(`${this.urlApi}/auth/google`, { email, accessToken }).subscribe({
            next: (response: any) => {
              this.userService.setCurrentUser({
            token: response.token,
            user: {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email
            }
          })
              this.accountService.setCurrentAccount(response.user.account)
              this.router.navigateByUrl('/home/account')
            },
            error: (error: any) => {
              console.log('Error:', error)
            }
          })
        } catch (error) {
          console.error('Erro no login:', error);
        }
      }
}