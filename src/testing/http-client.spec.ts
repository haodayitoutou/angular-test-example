import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

interface Data {
    name: string;
}

const testUrl = '/data';

describe('HttpClient testing', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('can test HttpClient.get', () => {
        const testData: Data = { name: 'Test Data' };

        httpClient.get<Data>(testUrl)
            .subscribe(data => {
                expect(data).toEqual(testData);
            });

        const req = httpTestingController.expectOne('/data');
        expect(req.request.method).toEqual('GET');
        req.flush(testData);
    });

    it('can test HttpClient.get with matching header', () => {
        const testData: Data = { name: 'Test Data' };

        httpClient.get<Data>(testUrl, {
            headers: new HttpHeaders({Authorization: 'my-autho-token'})
        }).subscribe(data => {
            expect(data).toEqual(testData);
        });

        const request = httpTestingController.expectOne(
            req => req.headers.has('Authorization')
        );
        request.flush(testData);
    });

    it('can test multiple requests', () => {
        const testData: Data[] = [
            { name: 'bob' }, { name: 'carol' },
            { name: 'ted' }, { name: 'alice' }
        ];
        httpClient.get<Data[]>(testUrl)
            .subscribe(d => expect(d.length).toEqual(0, 'should have no data'));
        httpClient.get<Data[]>(testUrl)
            .subscribe(d => expect(d).toEqual([testData[0]], 'should be one element array'));
        httpClient.get<Data[]>(testUrl)
            .subscribe(d => expect(d).toEqual(testData, 'should be expected data'));

        const requests = httpTestingController.match(testUrl);
        expect(requests.length).toEqual(3);
        requests[0].flush([]);
        requests[1].flush([testData[0]]);
        requests[2].flush(testData);
    });

    it('can test for 404 error', () => {
        const emsg = 'deliberate 404 error';
        httpClient.get<Data[]>(testUrl).subscribe(
            data => fail('should have failed with the 404 error'),
            (error: HttpErrorResponse) => {
                expect(error.status).toEqual(404, 'status');
                expect(error.error).toEqual(emsg, 'message');
            }
        );
        const req = httpTestingController.expectOne(testUrl);
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
    });

    it('can test for network error', () => {
        const emsg = 'simulated network error';
        httpClient.get<Data[]>(testUrl).subscribe(
            data => fail('should have failed with the network error'),
            (error: HttpErrorResponse) => {
                expect(error.error.message).toEqual(emsg, 'message');
            }
        );

        const req = httpTestingController.expectOne(testUrl);
        const mockError = new ErrorEvent('Network error', {
            message: emsg,
            filename: 'HeroService.ts',
            lineno: 42,
            colno: 21
        });
        req.error(mockError);
    });

    it('httpTestingController.verify should fail if HTTP response not simulated', () => {
        httpClient.get('some/api').subscribe();
        expect(() => httpTestingController.verify()).toThrow();
        const req = httpTestingController.expectOne('some/api');
        req.flush(null);
    });
});
