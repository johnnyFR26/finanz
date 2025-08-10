import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiArcChart} from '@taiga-ui/addon-charts';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {TuiNumberFormat, TuiTextfield} from '@taiga-ui/core';
import {TuiInputNumber} from '@taiga-ui/kit';

@Component({
    selector: 'accelometer',
    imports: [AsyncPipe, FormsModule, TuiAmountPipe, TuiArcChart, TuiInputNumber, TuiNumberFormat, TuiTextfield,],
    styleUrl: './accelometer.component.scss',
    template: `
        <tui-textfield
            class="index-controller"
            [tuiTextfieldCleaner]="false"
        >
            <label tuiLabel>activeItemIndex</label>

            <input
                tuiInputNumber
                [max]="value.length - 1"
                [min]="0"
                [ngModel]="activeItemIndex"
                [step]="1"
                [tuiNumberFormat]="{precision: 0}"
                (ngModelChange)="onTextfieldChange($event)"
            />
        </tui-textfield>

        <div class="wrapper">
            <tui-arc-chart
                size="m"
                class="tui-space_right-4"
                [value]="value"
                [(activeItemIndex)]="activeItemIndex"
            >
                Total value
            </tui-arc-chart>
            <tui-arc-chart
                size="l"
                class="tui-space_right-4"
                [value]="value"
                [(activeItemIndex)]="activeItemIndex"
            >
                Total value
                <div>Label</div>
            </tui-arc-chart>
            <tui-arc-chart
                size="xl"
                class="tui-space_right-4"
                [value]="value"
                [(activeItemIndex)]="activeItemIndex"
            >
                <span>{{ 123456 | tuiAmount: 'BRL' | async }}</span>
                <div>Not bad!</div>
            </tui-arc-chart>
        </div>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AccelometerComponent{
    protected readonly value = [40, 30, 20, 10];
 
    protected activeItemIndex = NaN;
 
    public onTextfieldChange(value: number | null): void {
        this.activeItemIndex = value ?? NaN;
    }
}