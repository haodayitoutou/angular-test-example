import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Hero } from './hero';
import { HeroService } from './hero.service';

import { asyncData, asyncError } from '../../testing/async-observable-helpers';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

describe('HeroService with spies', () => {
    let httpClientSpy: { get: jasmine.Spy, put: jasmine.Spy };
    let heroService: HeroService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
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

    it('should #getHero returns one hero', (done: DoneFn) => {
        const expectedHeroes: Hero[] = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ];
        httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

        heroService.getHero('1').subscribe(
            hero => {
                expect(hero).toEqual(expectedHeroes[0], 'expected hero when parameter is string');
                done();
            },
            fail
        );
        heroService.getHero(1).subscribe(
            hero => {
                expect(hero).toEqual(expectedHeroes[0], 'expected hero when parameter is integer');
                done();
            },
            fail
        );
    });

    it('should #getHero return null when no matched hero exists', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData([]));

        heroService.getHero(1).subscribe(
            hero => {
                expect(hero).toBeUndefined('expected null when return empty list');
                done();
            },
            fail
        );
    });

    it('should #updateHero does not alter api result', (done: DoneFn) => {
        const result: any = {};
        httpClientSpy.put.and.returnValue(asyncData(result));
        const hero = { id: 1, name: 'A' };
        heroService.updateHero(hero).subscribe(
            res => {
                expect(res).toEqual(result);
                done();
            },
            fail
        );
    });
});
