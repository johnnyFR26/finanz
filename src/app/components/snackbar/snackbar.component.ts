import { Component, Inject, inject } from "@angular/core";
import {
  
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
  } from '@angular/material/snack-bar'


@Component({
    selector: 'app-snackbar',
    imports: [],
    template: `
    <span class="example-pizza-party" matSnackBarLabel>
    {{data.message}}
  </span>
  <span class="close" matSnackBarActions>
    <button mat-button matSnackBarAction (click)="snackBarRef.dismissWithAction()">OK</button>
  </span>
    `,
    styles: `
    :host {
        display: flex;
      }
  
      .example-pizza-party {
        color: var(--red);
      }
      .close{
        margin-left: 20px;
      }
    `
})
export class SnackbarComponent {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    snackBarRef = inject(MatSnackBarRef<SnackbarComponent>)

}
