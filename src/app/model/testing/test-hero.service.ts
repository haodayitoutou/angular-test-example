import { Injectable } from '@angular/core';
import { HeroService } from '../hero.service';
import { getTestHeroes } from './test-heroes';

export { HeroService } from '../hero.service';
export { getTestHeroes } from './test-heroes';

@Injectable()
export class TestHeroService extends HeroService {
    constructor() {
        super(null);
    }

    heroes = getTestHeroes();
}
