import { effect, Injectable, OnDestroy, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ThemeService implements OnDestroy {

    protected darkMode = false;
    protected theme = signal(this.loadThemeFromLocalStorage() ?? "system");
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    private mediaListener = () => this.checkTheme();

    constructor() {
      this.mediaQuery.addEventListener('change', this.mediaListener);
      effect(()=> {
        this.syncThemeWithLocalStorage()
        this.checkTheme();
      })
    }

    ngOnDestroy() {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
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
      if(this.theme() == "system" && this.mediaQuery.matches || this.theme() == "dark"){
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
