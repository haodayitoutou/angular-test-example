import {
    async, ComponentFixture, fakeAsync, inject, TestBed, tick
} from '@angular/core/testing';

import { Router } from '@angular/router';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroModule } from './hero.module';
import { ActivatedRoute, ActivatedRouteStub, newEvent } from '../../testing';

let activatedRoute: ActivatedRouteStub;
let component: HeroDetailComponent;
let fixture: ComponentFixture<HeroDetailComponent>;

describe('HeroDetailComponent', () => {
    beforeEach(() => {
        activatedRoute = new ActivatedRouteStub();
    });
    describe('with HeroModule setup', heroModuleSetup);
});

import { getTestHeroes, TestHeroService, HeroService } from '../model/testing/test-hero.service';

const firstHero = getTestHeroes()[0];

function heroModuleSetup() {
    beforeEach(async(() => {
        const routerSpy = createRouterSpy();

        TestBed.configureTestingModule({
            imports: [HeroModule],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: Router, useValue: routerSpy },
                { provide: HeroService, useClass: TestHeroService }
            ]
        })
        .compileComponents();
    }));

    describe('when navigate to existing hero', () => {
        beforeEach(async(() => {
            createComponent();
        }));

        it('should convert hero name to Title Case', () => {
            const hostElement = fixture.nativeElement;
            const nameInput: HTMLInputElement = hostElement.querySelector('input');
            const nameDisplay: HTMLElement = hostElement.querySelector('span');

            nameInput.value = 'quick BROWN fOx';

            nameInput.dispatchEvent(newEvent('input'));
            fixture.detectChanges();
            expect(nameDisplay.textContent).toBe('Quick Brown Fox');
        });
    });
}

function createComponent() {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    // first change detection triggers ngOnInit which gets a hero
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
        // second change detection displays the async-fetched hero
        fixture.detectChanges();
    });
}

function createRouterSpy() {
    return jasmine.createSpyObj('Router', ['navigate']);
}
