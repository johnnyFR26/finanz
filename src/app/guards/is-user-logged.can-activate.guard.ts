import { CanActivate, CanActivateFn } from "@angular/router";

export const isUserLogged: CanActivateFn = () => {
    return true
}