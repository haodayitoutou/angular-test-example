import { UserService } from './user.service';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    it('should isLoggedIn be true', () => {
        expect(userService.isLoggedIn).toBe(true);
    });

    it('should user name be sam', () => {
        expect(userService.user).toBeDefined();
        expect(userService.user.name).toBe('Sam Spade');
    });
});
