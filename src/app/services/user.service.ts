import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { createUser } from "../models/user.model";
import { UserStorage } from "../models/user-storage.model";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient)
    private router = inject(Router)
    private userInfo = signal<UserStorage | null>(this.loadUserFromLocalStorage())
    private urlApi = environment.urlApi
    private auth: Auth = inject(Auth)
    private googleProvider = new GoogleAuthProvider();

    constructor(){
        effect(() => {
            this.syncUserInfoWithLocalStorage()
        })
    }

    async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider)
      //@ts-ignore
      const { email, accessToken } = result.user

      console.log('Login com Google bem-sucedido:', email, accessToken);
      this.http.post(`${this.urlApi}/auth/google`, { email, accessToken }).subscribe({
        next: (response: any) => {
          this.setCurrentUser(response)
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

  async logout() {
    try {
      await signOut(this.auth);
      console.log('Logout bem-sucedido');
      // Redirecionar o usuário, etc.
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

    createUserObserVable(user: createUser){
        return this.http.post(`${this.urlApi}/users`, user).subscribe({
            next: (response: any) => {
                console.log('Response:', response)

                if(!response){
                    return console.log("DEU MERDA", response)
                }else{
                    this.router.navigateByUrl('/login')
                    console.log("DEU CERTO")
                }
            },
            error: (error: any) => {
                console.log('Error:', error)
                this.openSnackBar(error.error.error)
            }
        })
    }

    loginUser(user: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.urlApi}/auth/login`, user)
    }

    deleteUser(){
        return this.http.delete(`${this.urlApi}/users/${this.userInfo()?.user.email}`).subscribe({
            next: (response: any) => {
                console.log('Response:', response)
                this.setCurrentUser(null)
                this.router.navigateByUrl('/login')
            },
            error: (error: any) => {
                console.log('Error:', error)
            }
        })
    }

    syncUserInfoWithLocalStorage() {
        if (this.userInfo()) {
            localStorage.setItem('UserData', JSON.stringify(this.userInfo()))
        } else {
            localStorage.removeItem('UserData')
        }
    }

    setCurrentUser(user: UserStorage | null) {
        this.userInfo.set(user)
    }

    getUserInfo() {
        return this.userInfo.asReadonly()
    }

    isUserLogged() {
        return !!this.userInfo()
    }

    private loadUserFromLocalStorage(): UserStorage | null {
        const storedUser = localStorage.getItem('UserData')
        return storedUser ? JSON.parse(storedUser) : null
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
