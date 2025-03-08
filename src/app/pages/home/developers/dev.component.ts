import { Component } from "@angular/core";

@Component({
    selector: 'app-dev',
    template: `
    <div class="dev">
        <div class="dev__container">
            <h1 class="dev__title">Desenvolvedores</h1>
            @for (dev of developers; track $index) {
                <div class="dev__card">
                    <h2 class="dev__name">{{dev.name}}</h2>
                    <p class="dev__description">{{dev.role}}</p>
                </div>
            }
        </div>
    </div>
    `,
    styles: `
    .dev{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }`,
    imports: []
})
export class DevComponent {
    protected developers = [
        {
            "name": "Johnny Fontes",
            "role": "DevOps Engineer"
        },
        {
            "name": "Alyson Gabriel",
            "role": "Frontend Developer"
        },
        {
            "name": "Eric Sandes",
            "role": "Web Designer"
        },
        {
            "name": "Pedro Augusto Baum",
            "role": "Web Developer"
        },
        {
            "name": "Orlando Furlaneto",
            "role": "QA Engineer"
        }
    ]

}