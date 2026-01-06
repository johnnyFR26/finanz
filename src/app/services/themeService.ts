import { effect, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ThemeService {

    protected darkMode = false;
    protected theme = signal(this.loadThemeFromLocalStorage() ?? "system");

    constructor() {
      effect(()=> {
        this.syncThemeWithLocalStorage()
        this.checkTheme();
      })
    }

    getTheme(){
        return this.theme();
    }

    getDarkTheme(){
        return this.darkMode;
    }

    updateTheme(theme: String) {
        this.theme.set(theme);
        this.syncThemeWithLocalStorage();
        this.checkTheme();
    }

    checkTheme() {
      if(this.theme() == "system" && window.matchMedia('(prefers-color-scheme: dark)').matches || this.theme() == "dark"){
        this.darkMode = true;
      } else {
        this.darkMode = false;
      }
      this.applicateTheme();
    }

    syncThemeWithLocalStorage(){
        //@ts-ignore
        localStorage.setItem('ThemeData', this.theme())
    }
    
    loadThemeFromLocalStorage(): String | null{
        return localStorage.getItem('ThemeData');
    }

    applicateTheme() {
        document.body.classList.toggle('dark', this.darkMode);
    }
}