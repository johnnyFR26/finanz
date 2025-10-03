import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";

export const isUserPlanPremmium: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);
    const user = userService.getUserInfo();

    if (user()?.user?.controls?.plan === 'PREMIUM') {
        return true;
    }
    else{
        router.navigateByUrl('/home/createAccount');
        return false
    }

};
