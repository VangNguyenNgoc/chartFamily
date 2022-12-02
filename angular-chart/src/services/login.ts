import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // get url backend from env config
  nodejsApi: string = environment.nodejsApi;

  constructor(private httpClient: HttpClient) {}
  // get token and store cookie from BE nodejs
  login(username: string, password: string) {
    return this.httpClient.post<any>(`${this.nodejsApi}/api/login`, {
      username,
      password,
    });
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('tokenUser');
  }
}
