import { inject } from '@angular/core';
import { UserService } from './../services/user.service';
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const userService = inject(UserService)
    const user = userService.getUserInfo()
    const token = user()?.token
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next(req);
}