import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        const token = this.tokenService.GetToken();
        if (token != null) { //??????
            headersConfig['Authorization'] = 'beader &{token}';
        }
        const _req = req.clone({ setHeaders: headersConfig });
        return next.handle(_req);
    }
}



