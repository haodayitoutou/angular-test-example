import { TestBed } from '@angular/core/testing';
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

