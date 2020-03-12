import {
    MasterService,
    ValueService,
} from './demo';

export class FakeValueService extends ValueService {
    value = 'faked service value';
}

function setup() {
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    const stubValue = 'stub value';
    const masterService = new MasterService(valueServiceSpy);
    valueServiceSpy.getValue.and.returnValue(stubValue);
    return {
        masterService,
        stubValue,
        valueServiceSpy
    };
}

describe('ValueService', () => {
    let service: ValueService;
    beforeEach(() => {
        service = new ValueService();
    });

    it('#getValue should return real value', () => {
        expect(service.getValue()).toBe('real value');
    });

    it('#getObservableValue should return value from observable', (done: DoneFn) => {
        service.getObservableValue().subscribe(value => {
            expect(value).toBe('observable value');
            done();
        });
    });

    it('#getPromiseValue should return value from a promise', (done: DoneFn) => {
        service.getPromiseValue().then(value => {
            expect(value).toBe('promise value');
            done();
        });
    });
});

describe('MasterService without Angular testing support', () => {
    let masterService: MasterService;

    it('#getValue should return real value from the ral service', () => {
        masterService = new MasterService(new ValueService());
        expect(masterService.getValue()).toBe('real value');
    });

    it('#getValue should return faked value from a fakeService', () => {
        masterService = new MasterService(new FakeValueService());
        expect(masterService.getValue()).toBe('faked service value');
    });

    it('#getValue should return stubbed value from a spy', () => {
        const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);

        const stubValue = 'stub value';
        valueServiceSpy.getValue.and.returnValue(stubValue);

        masterService = new MasterService(valueServiceSpy);

        expect(masterService.getValue())
            .toBe(stubValue, 'service returned stub value');
        expect(valueServiceSpy.getValue.calls.count())
            .toBe(1, 'spy method was called once');
        expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
            .toBe(stubValue);
    });
});

describe('MasterService without beforeEach', () => {
    it('#getValue should return stubbed value from a spy', () => {
        const { masterService, stubValue, valueServiceSpy } = setup();
        expect(masterService.getValue())
            .toBe(stubValue, 'service returned stub value');
        expect(valueServiceSpy.getValue.calls.count())
            .toBe(1, 'spy method was called once');
        expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
            .toBe(stubValue);
    });
});
