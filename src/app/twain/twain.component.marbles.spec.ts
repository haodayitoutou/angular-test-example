import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { TwainService } from './twain.service';
import { TwainComponent } from './twain.component';

describe('TwainComponent (marbles)', () => {
    let comp: TwainComponent;
    let fixture: ComponentFixture<TwainComponent>;
    let getQuoteSpy: jasmine.Spy;
    let quoteEl: HTMLElement;
    let testQuote: string;

    const errorMessage = () => {
        const el = fixture.nativeElement.querySelector('.error');
        return el ? el.textContent : null;
    };

    beforeEach(() => {
        const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
        getQuoteSpy = twainService.getQuote;

        TestBed.configureTestingModule({
            declarations: [TwainComponent],
            providers: [
                { provide: TwainService, useValue: twainService }
            ]
        });

        fixture = TestBed.createComponent(TwainComponent);
        comp = fixture.componentInstance;
        quoteEl = fixture.nativeElement.querySelector('.twain');
        testQuote = 'Test Quote';
    });

    // a synchronous test that simulates async behavior
    it('should show quote after getQuote (marbles)', () => {
        // observable test quote value and complete(), after delay
        const q$ = cold('---x|', { x: testQuote });
        getQuoteSpy.and.returnValue(q$);

        fixture.detectChanges();
        expect(quoteEl.textContent).toBe('...', 'should show placeholder');

        getTestScheduler().flush(); // flush the observables
        fixture.detectChanges();

        expect(quoteEl.textContent).toBe(testQuote, 'should show quote');
        expect(errorMessage()).toBeNull('should not show error');
    });

    // still need fakeAsync() because of component's setTimeout()
    it('should display error when TwainService fails', fakeAsync(() => {
        const q$ = cold('---#|', null, new Error('TwainService test failure'));
        getQuoteSpy.and.returnValue(q$);
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe('...', 'should show placeholder');

        getTestScheduler().flush(); // flush the observables
        tick(); // component shows error after a setTimeout();
        fixture.detectChanges(); // update error message
        expect(errorMessage()).toMatch(/test failure/, 'should display error');
        expect(quoteEl.textContent).toBe('...', 'should show placeholder');
    }));
});
