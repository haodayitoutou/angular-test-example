import { MasterService, ValueService } from './demo';
import { TestBed } from '@angular/core/testing';

describe('demo with TestBed', () => {
    describe('ValueService', () => {
        let service: ValueService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [ValueService]
            });
        });

        it('should use ValueService', () => {
            service = TestBed.get(ValueService);
            expect(service.getValue()).toBe('real value');
        });
    });

    describe('MasterService', () => {
        let masterService: MasterService;
        let valueServiceSpy: jasmine.SpyObj<ValueService>;

        beforeEach(() => {
            const spy = jasmine.createSpyObj('ValueService', ['getValue']);

            TestBed.configureTestingModule({
                providers: [
                    MasterService,
                    { provide: ValueService, useValue: spy }
                ]
            });

            masterService = TestBed.get(MasterService);
            valueServiceSpy = TestBed.get(ValueService);
        });

        it('#getValue should return stubbed value from a spy', () => {
            const stubValue = 'stub value';
            valueServiceSpy.getValue.and.returnValue(stubValue);

            expect(masterService.getValue())
                .toBe(stubValue, 'service returned stub value');
            expect(valueServiceSpy.getValue.calls.count())
                .toBe(1, 'spy method was called once');
            expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
                .toBe(stubValue);
        });
    });
});
