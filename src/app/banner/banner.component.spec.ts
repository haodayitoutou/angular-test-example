import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BannerComponent } from './banner.component';

describe('BannerComponent (initial CLI generated)', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let h1: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BannerComponent ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        h1 = fixture.nativeElement.querySelector('h1');
    });

    it('should display original title', () => {
        // fixture.detectChanges();
        expect(h1.textContent).toContain(component.title);
    });

    it('should still see original title after comp.title change', () => {
        const oldTitle = component.title;
        component.title = 'Test Title';
        expect(h1.textContent).toContain(oldTitle);
    });

    it('should display updated title after detectChanges', () => {
        component.title = 'Test Title';
        fixture.detectChanges();
        expect(h1.textContent).toContain(component.title);
    });
});
