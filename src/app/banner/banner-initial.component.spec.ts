import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner-initial.component';
import { DebugElement } from '@angular/core';

describe('BannerComponent (inline template)', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BannerComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});

describe('BannerComponent with beforeEach', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent]
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should contain "banner works!"', () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        expect(bannerElement.textContent).toContain('banner works!');
    });

    it('should have <p> with "banner works!"', () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const p = bannerElement.querySelector('p');
        expect(p.textContent).toContain('banner works!');
    });

    it('should find the <p> with fixture.debugElement.nativeElement', () => {
        const bannerDe: DebugElement = fixture.debugElement;
        const bannerEl: HTMLElement = bannerDe.nativeElement;
        const p = bannerEl.querySelector('p');
        expect(p.textContent).toEqual('banner works!');
    });

    it('should find the <p> with By.css', () => {
        const bannerDe: DebugElement = fixture.debugElement;
        const pDe = bannerDe.query(By.css('p'));
        const p: HTMLElement = pDe.nativeElement;
        expect(p.textContent).toContain('banner works!');
    });
});
