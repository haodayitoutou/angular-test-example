import { OnInit, Component } from '@angular/core';
import { UserService } from '../model/user.service';

@Component({
    selector: 'app-welcome',
    template: '<h3 class="welcome"><i>{{welcome}}</i></h3>'
})
export class WelcomeComponent implements OnInit {
    welcome: string;
    constructor(
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.welcome = this.userService.isLoggedIn ?
            'Welcome, ' + this.userService.user.name : 'Please log in';
    }
}
