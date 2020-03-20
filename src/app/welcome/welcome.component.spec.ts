import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { UserService } from '../model/user.service';

class MockUserService {
    isLoggedIn = true;
    user = {
        name: 'Test user'
    };
}

describe('WelcomeComponent (class only)', () => {
    let comp: WelcomeComponent;
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WelcomeComponent,
                { provide: UserService, useClass: MockUserService }
            ]
        });

        comp = TestBed.get(WelcomeComponent);
        userService = TestBed.get(UserService);
    });

    it('should not have welcome message after construction', () => {
        expect(comp.welcome).toBeUndefined();
    });

    it('should welcome logged in user after Augular calls ngOnInit', () => {
        comp.ngOnInit();
        expect(comp.welcome).toContain(userService.user.name);
    });

    it('should ask user to log in if not logged in after ngOnInit', () => {
        userService.isLoggedIn = false;
        comp.ngOnInit();
        expect(comp.welcome).not.toContain(userService.user.name);
        expect(comp.welcome).toContain('log in');
    });
});

describe('WelcomeComponent', () => {
    let comp: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    let compUserService: UserService; // the actually injected service
    let userService: UserService; // the TestBed injected service
    let el: HTMLElement;

    let userServiceStub: Partial<UserService>;

    beforeEach(() => {
        userServiceStub = {
            isLoggedIn: true,
            user: {
                name: 'Test User'
            }
        };

        TestBed.configureTestingModule({
            declarations: [WelcomeComponent],
            providers: [{ provide: UserService, useValue: userServiceStub }]
        });
        fixture = TestBed.createComponent(WelcomeComponent);
        comp = fixture.componentInstance;
        // UserService actually injected into the component
        userService = fixture.debugElement.injector.get(UserService);
        compUserService = userService;
        // UserService from the root injector
        userService = TestBed.get(UserService);

        el = fixture.nativeElement.querySelector('.welcome');
    });

    it('should welcome the user', () => {
        fixture.detectChanges();
        const content = el.textContent;
        expect(content).toContain('Welcome', '"Welcome ..."');
        expect(content).toContain('Test User', 'expected name');
    });

    it('should welcome "Bubba"', () => {
        userService.user.name = 'Bubba';
        fixture.detectChanges();
        expect(el.textContent).toContain('Bubba');
    });

    it('should request login if not logged in', () => {
        userService.isLoggedIn = false;
        fixture.detectChanges();
        const content = el.textContent;
        expect(content).not.toContain('Welcome', 'not welcomed');
        expect(content).toMatch(/log in/i, '"log in"');
    });

    it('should inject the component\'s UserService instance', inject([UserService], (service: UserService) => {
        expect(service).toBe(compUserService);
    }));

    it('TestBed and Component UserService should be the same', () => {
        expect(userService === compUserService).toBe(true);
    });

    it('stub object and injected UserService should not be the same', () => {
        expect(userServiceStub === userService).toBe(false);
        // changing the stub object has no effect on the injected service
        userServiceStub.isLoggedIn = false;
        expect(userService.isLoggedIn).toBe(true);
    });
});
