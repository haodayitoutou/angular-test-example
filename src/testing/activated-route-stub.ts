import { ReplaySubject } from 'rxjs';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

export { ActivatedRoute } from '@angular/router';

export class ActivatedRouteStub {
    // use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private subject = new ReplaySubject<ParamMap>();

    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    readonly paramMap = this.subject.asObservable();

    setParamMap(params?: Params) {
        this.subject.next(convertToParamMap(params));
    }
}
