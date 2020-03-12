import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';

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
