import { async, fakeAsync, TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';
import { asyncData, asyncError } from '../../testing';

describe('TwainComponent', () => {
    let fixture: ComponentFixture<TwainComponent>;
    let comp: TwainComponent;
    let quoteEl: HTMLElement;
    let testQuote: string;
    let getQuoteSpy: jasmine.Spy;

    const errorMessage = () => {
        const el = fixture.nativeElement.querySelector('.error');
        return el ? el.textContent : null;
    };

    beforeEach(() => {
        testQuote = 'Test QUote';

        const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
        getQuoteSpy = twainService.getQuote.and.returnValue(of(testQuote));

        TestBed.configureTestingModule({
            declarations: [TwainComponent],
            providers: [
                { provide: TwainService, useValue: twainService }
            ]
        });

        fixture = TestBed.createComponent(TwainComponent);
        comp = fixture.componentInstance;
        quoteEl = fixture.nativeElement.querySelector('.twain');
    });

    describe('when test with synchronous observable', () => {
        it('should not show quote before onInit', () => {
            expect(quoteEl.textContent).toBe('', 'nothing displayed');
            expect(errorMessage()).toBeNull('should not show error element');
            expect(getQuoteSpy.calls.any()).toBe(false, 'getQuote not yet called');
        });

        it('should show quote after component initialized', () => {
            fixture.detectChanges(); // ngOnit()
            // sync spy result shows testQuote immediately after init
            expect(quoteEl.textContent).toBe(testQuote);
            expect(getQuoteSpy.calls.any()).toBe(true, 'getQuote called');
        });

        it('should display erro when TwainService fails', fakeAsync(() => {
            getQuoteSpy.and.returnValue(
                throwError('TwainService test failure')
            );
            fixture.detectChanges(); // onInit
            // sync spy errors immediately after init
            tick(); // flush the component's setTimeout()
            fixture.detectChanges();
            expect(errorMessage()).toMatch(/test failure/, 'should display error');
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');
        }));
    });

    describe('when test with asynchronous observable', () => {
        beforeEach(() => {
            getQuoteSpy.and.returnValue(asyncData(testQuote));
        });

        it('should not show quote before onInit', () => {
            expect(quoteEl.textContent).toBe('', 'nothing displayed');
            expect(errorMessage()).toBeNull('should not show error element');
            expect(getQuoteSpy.calls.any()).toBe(false, 'getQuote not yet called');
        });

        it('should still not show quote after component initialized', () => {
            fixture.detectChanges();
            // getQuote service is async => still has not returned with quote
            // so should show the start value '...'
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');
            expect(errorMessage()).toBeNull('should not show error');
            expect(getQuoteSpy.calls.any()).toBe(true, 'getQuote called');
            expect(getQuoteSpy.calls.count()).toBe(1, 'getQuote called');
        });

        it('should show quote after getQuote (fakeAsync)', fakeAsync(() => {
            fixture.detectChanges(); // onInit()
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');
            tick(); // flush the observable to get the quote
            fixture.detectChanges(); // update view
            expect(quoteEl.textContent).toBe(testQuote, 'should show quote');
            expect(errorMessage()).toBeNull('should not show error');
        }));

        it('should show quote after getQuote (async)', async(() => {
            fixture.detectChanges(); // onInit()
            expect(quoteEl.textContent).toBe('...', 'should show placeholder');

            fixture.whenStable().then(() => { // wait for async getQuote
                fixture.detectChanges(); // update view
                expect(quoteEl.textContent).toBe(testQuote);
                expect(errorMessage()).toBeNull('should not show error');
            });
        }));

        it('should show last quote (quote done)', (done: DoneFn) => {
            fixture.detectChanges();

            comp.quote.pipe(
                last()
            ).subscribe(() => {
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote);
                expect(errorMessage()).toBeNull('should not show error');
                done();
            });
        });

        it('should show quote after getQuote (spy done)', (done: DoneFn) => {
            fixture.detectChanges();

            getQuoteSpy.calls.mostRecent().returnValue.subscribe(() => {
                fixture.detectChanges();
                expect(quoteEl.textContent).toBe(testQuote);
                expect(errorMessage()).toBeNull('should not show error');
                done();
            });
        });

        it('should display error when TwainService fails', fakeAsync(() => {
            getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure'));
            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(errorMessage()).toMatch(/test failure/, 'should display error');
            expect(quoteEl.innerText).toBe('...', 'should show placeholder');
        }));
    });
});
