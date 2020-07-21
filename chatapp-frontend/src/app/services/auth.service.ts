import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //send request to register route in server
  registerUser(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/register', body);
  }
  //send request to login route in server
  loginUser(body): Observable<any> {
    return this.http.post('http://localhost:3000/api/chatapp/login', body);
  }
}
