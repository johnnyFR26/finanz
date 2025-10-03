import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { UserService } from "../services/user.service";

/**
 * Checks if the user has a premium plan.
 * If the user has a premium plan, the guard returns true.
 * If the user does not have a premium plan, the guard redirects the user to the create account page and returns false.
 * @returns {boolean} True if the user has a premium plan, false otherwise.
 */
export const isUserPlanPremium: CanActivateFn = () => {
    const userService = inject(UserService);
    const user = userService.getUserInfo();

    if (user()?.user?.controls?.plan === 'premium') {
        return true;
    }
    else{
        return false
    }

};
