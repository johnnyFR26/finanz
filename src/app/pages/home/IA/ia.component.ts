import { AfterViewInit, Component, inject } from "@angular/core";
import { UserService } from "../../../services/user.service";

@Component({
    selector: "app-ia",
    templateUrl: "./ia.component.html",
    styleUrls: ["./ia.component.scss"],
})
export class IAComponent implements AfterViewInit {
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected initial: string = `Ola ${this.user()?.user?.name}, como posso te ajudar hoje?`

    ngAfterViewInit(): void {
        const element = document.querySelector('#first-message') as HTMLElement
        let index = 0
        const type = () => {
            if(index < this.initial.length){
                element.innerHTML += this.initial.charAt(index);
                index++;
        setTimeout(type, 70);
            }
        }
        type()
    }


}