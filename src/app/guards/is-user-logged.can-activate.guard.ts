import { inject } from '@angular/core';
import { UserService } from './../services/user.service';
import { CanActivate, CanActivateFn, Router } from "@angular/router";

export const isUserLogged: CanActivateFn = () => {
    const userService = inject(UserService)
    const router = inject(Router)

    if (userService.isUserLogged()) {
        return true
    }

    return router.navigateByUrl('/login')
}