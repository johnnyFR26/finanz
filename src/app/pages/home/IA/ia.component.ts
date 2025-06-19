import { Component, inject } from "@angular/core";
import { UserService } from "../../../services/user.service";

@Component({
    selector: "app-ia",
    templateUrl: "./ia.component.html",
    styleUrls: ["./ia.component.scss"],
})
export class IAComponent {
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
}