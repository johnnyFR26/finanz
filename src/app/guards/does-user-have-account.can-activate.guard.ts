import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "../services/account.service";

export const doesUserHaveAccount: CanActivateFn = () => {

    const accountService = inject(AccountService)
    const router = inject(Router)

    if (accountService.getCurrentAccount() !== null) {
        return true
    }

    return router.navigateByUrl('/home/createAccount')
}