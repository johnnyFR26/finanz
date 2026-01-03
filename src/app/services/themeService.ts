import { inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
    readonly userService = inject(UserService);
    readonly user = this.userService.getUserInfo();
    
    protected theme = "";
    protected darkMode = false;

    constructor() {
      if (this.user != null && this.user()?.user.controls.theme){
        this.theme = this.user()?.user.controls.theme
      } else {
        this.theme = "system"
      }

      this.checkTheme();
    }

    getTheme(){
        return this.theme;
    }

    getDarkTheme(){
        return this.darkMode;
    }

    updateTheme(theme: string) {
        this.theme = theme;
        this.checkTheme();
    }

    checkTheme() {
      if(this.theme == "system" && window.matchMedia('(prefers-color-scheme: dark)').matches || this.theme == "dark"){
        this.darkMode = true;
      } else {
        this.darkMode = false;
      }
      this.applicateTheme();
    }

    applicateTheme() {
        document.body.classList.toggle('dark', this.darkMode);
    }
}