import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Observer, of, throwError, concat } from 'rxjs';
import { switchMap, map, retryWhen, take } from 'rxjs/operators';
import { Quote } from './quote';

@Injectable()
export class TwainService {
    constructor(private http: HttpClient) { }

    private nextId = 1;

    getQuote(): Observable<string> {
        return new Observable((observer: Observer<number>) => observer.next(this.nextId++))
                    .pipe(
                        switchMap((id: number) => this.http.get<Quote>(`api/quotes/${id}`)),
                        map((q: Quote) => q.quote),
                        retryWhen(errors => errors.pipe(
                            switchMap((error: HttpErrorResponse) => {
                                if (error.status === 404) {
                                    this.nextId = 1; // retry with quote id:1
                                    return of(null); // signal OK to retry
                                }
                                // some other http error
                                console.error(error);
                                return throwError('Cannot get Twain quotes from server');
                            }),
                            take(2),
                            o => concat(o, throwError('There are no Twain quotes')) // didn't find id:1
                        ))
                    );
    }
}
