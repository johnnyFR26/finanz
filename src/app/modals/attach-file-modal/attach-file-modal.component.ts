import { Component } from "@angular/core";

@Component({
    selector: "attach-file-modal",
    styleUrls: ["./attach-file-modal.component.scss"],
    imports: [],
    template: `
        <input #file type="file" name="file" id="file" display="none">
        <label for="file">Anexar arquivo</label>
        <button (click)="file.click()" class="send-file">Enviar arquivo</button>
    `
})
export class AttachFileModalComponent {}