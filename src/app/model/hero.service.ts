import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

    readonly heroesUrl = 'api/heroes';

    constructor(
        private http: HttpClient
    ) {}

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                tap(heroes => this.log(`fetched heroes`)),
                catchError(this.handleError('getHeroes'))
            ) as Observable<Hero[]>;
    }

    getHero<Data>(id: number | string): Observable<Hero> {
        if (typeof id === 'string') {
            id = parseInt(id, 10);
        }
        const url = `${this.heroesUrl}/?id=${id}`;
        return this.http.get<Hero[]>(url)
            .pipe(
                map(heroes => heroes[0]),
                tap(h => {
                    const outcome = h ? `fetched` : 'did not find';
                    this.log(`${outcome} hero id=${id}`);
                }),
                catchError(this.handleError<Hero>(`getHero id=${id}`))
            );
    }

    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }

    private handleError<T>(operation) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(error);
            const message = (error.error instanceof ErrorEvent) ?
                error.error.message :
                `server returned code ${error.status} with body "${error.error}"`;
            throw new Error(`${operation} failed: ${message}`);
        };
    }

    private log(message: string) {
        console.log('HeroService: ' + message);
    }
}
