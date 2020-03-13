import { Injectable, Component } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class ValueService {
    value = 'real value';

    getValue() {
        return this.value;
    }

    getObservableValue() {
        return of('observable value');
    }

    getPromiseValue() {
        return Promise.resolve('promise value');
    }
}

@Injectable()
export class MasterService {
    constructor(
        private valueService: ValueService
    ) {}

    getValue() {
        return this.valueService.getValue();
    }
}

@Component({
    selector: 'app-lightswitch-comp',
    template: `
        <button (click)="clicked()">Click me!</button>
        <span>{{message}}</span>
    `
})
export class LightswitchComponent {
    isOn = false;

    clicked() {
        this.isOn = !this.isOn;
    }

    get message() {
        return `The light is ${this.isOn ? 'On' : 'Off'}`;
    }
}
