import { AfterViewInit, Component, inject } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { IaService } from "../../../services/ia.service";

@Component({
    selector: "app-ia",
    templateUrl: "./ia.component.html",
    styleUrls: ["./ia.component.scss"],
    imports: [MatIconModule, FormsModule]
})
export class IAComponent implements AfterViewInit {
    private userService = inject(UserService)
    protected user = this.userService.getUserInfo()
    protected initial: string = `Ola ${this.user()?.user?.name}, como posso te ajudar hoje?`
    protected message: string = ''
    protected messasges: string[] = []
    private iaService = inject(IaService)


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

    sendMessage() {
        console.log(this.message)
        this.messasges.push(this.message)
        this.iaService.sendMessage(this.message).subscribe(res => {
            //@ts-expect-error
            this.messasges.push(res.message)
        })
        this.message = ''
    }

}