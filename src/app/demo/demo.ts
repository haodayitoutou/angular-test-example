import { Injectable } from '@angular/core';
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
