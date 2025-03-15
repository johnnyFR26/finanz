import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "../services/account.service";

export const doesUserHaveAccount: CanActivateFn = () => {
    const accountService = inject(AccountService);
    const router = inject(Router);

    console.log('AccountService:', accountService.isAccountCreated())
    if (accountService.isAccountCreated()){
        return true;
    }
    else{
        router.navigateByUrl('/home/createAccount');
        return false
    }

};
