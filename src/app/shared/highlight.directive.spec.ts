import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HighlightDirective } from './highlight.directive';
import { newEvent } from '../../testing';

@Component({
    template: `
        <h2 highlight="yellow">Something Yellow</h2>
        <h2 highlight>The Default (Gray)</h2>
        <h2>No Highlight</h2>
        <input #box [highlight]="box.value" value="cyan"/>
    `
})
class TestComponent {}

describe('HighlightDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let des: DebugElement[]; // the three elements w/ the directive
    let bareH2: DebugElement; // the <h2> w/o the directive

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [HighlightDirective, TestComponent]
        })
            .createComponent(TestComponent);
        fixture.detectChanges();
        des = fixture.debugElement.queryAll(By.directive(HighlightDirective));
        bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));
    });

    // color tests
    it('should have three highlighted elements', () => {
        expect(des.length).toBe(3);
    });

    it('should color 1st <h2> background "yellor"', () => {
        const bgColor = des[0].nativeElement.style.backgroundColor;
        expect(bgColor).toBe('yellow');
    });

    it('should color 2nd <h2> backgound w/ default color', () => {
        const dir = des[1].injector.get(HighlightDirective) as HighlightDirective;
        const bgColor = des[1].nativeElement.style.backgroundColor;
        expect(bgColor).toBe(dir.defaultColor);
    });

    it('should bind <input> background to value color', () => {
        const input = des[2].nativeElement as HTMLInputElement;
        expect(input.style.backgroundColor).toBe('cyan', 'initial bgColor');
        // dispatch a DOM event so that angular responds to the input value change
        input.value = 'green';
        input.dispatchEvent(newEvent('input'));
        fixture.detectChanges();
        expect(input.style.backgroundColor).toBe('green', 'changed bgColor');
    });

    it('bare <h2> should not have a customProperty', () => {
        expect(bareH2.properties.customProperty).toBeUndefined();
    });

    it('can inject `HighlightDirective` in 1st <h2>', () => {
        const dir = des[0].injector.get(HighlightDirective);
        expect(dir).toBeTruthy();
    });

    it('cannot inject `HighlightDirective` in 3rd <h2>', () => {
        const dir = bareH2.injector.get(HighlightDirective, null);
        expect(dir).toBe(null);
    });

    it('should have `HighlightDirective` in 1st <h2> providerTokens', () => {
        expect(des[0].providerTokens).toContain(HighlightDirective);
    });

    it('should not have `HighlightDirective` in 3rd <h2> providerTokens', () => {
        expect(bareH2.providerTokens).not.toContain(HighlightDirective);
    });
});
