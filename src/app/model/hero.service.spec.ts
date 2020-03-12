import { Hero } from './hero';
import { HeroService } from './hero.service';

import { asyncData, asyncError } from '../../testing/async-observable-helpers';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

describe('HeroService with spies', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let heroService: HeroService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        heroService = new HeroService(httpClientSpy as any);
    });

    it('should url be api/heroes', () => {
        expect(heroService.heroesUrl).toBe('api/heroes');
    });

    it('should return expected heroes (HttpClient called once)', (done: DoneFn) => {
        const expectedHeroes: Hero[] = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ];
        httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));
        heroService.getHeroes().subscribe(
            heroes => {
                expect(heroes).toEqual(expectedHeroes, 'expected heroes');
                done();
            },
            fail
        );

        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return an error when the server returns a 404', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404,
            statusText: 'not found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));
        heroService.getHeroes().subscribe(
            heroes => fail('expected an error, not heroes'),
            error => {
                expect(error.message).toContain('test 404 error');
                done();
            }
        );
    });

    it('should return an error when the server return an erroEvent', (done: DoneFn) => {
        const errorEvent = new ErrorEvent('500 error', {
            message: 'server returned errorEvent'
        });
        const errorResponse = new HttpErrorResponse({
            error: errorEvent,
            status: 500,
            statusText: 'server error'
        });
        httpClientSpy.get.and.returnValue(asyncError(errorResponse));
        heroService.getHeroes().subscribe(
            heroes => fail('expected an error, not heroes'),
            error => {
                expect(error.message).toContain('errorEvent');
                done();
            }
        );
    });
});
