import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PersonService {
  // get url backend from env config
  nodejsApi: string = environment.nodejsApi;

  constructor(private httpClient: HttpClient) {}
  // get token and store cookie from BE nodejs
  getData(): Observable<any> {
    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    return this.httpClient.get<any>(
      `${this.nodejsApi}/api/person/getall`,
      optionsHeader
    );
  }

  getDataFromNode(query: string): any {
    return this.httpClient.get<any>(
      `${this.nodejsApi}/api/person/getdatafromnode/${query}`
    );
  }

  getDataById(id: string): any {
    return this.httpClient.get<any>(
      `${this.nodejsApi}/api/person/getdatabyid/${id}`
    );
  }

  getDataCanWedding(): any {
    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    return this.httpClient.get<any>(
      `${this.nodejsApi}/api/person/getdatacanwedding`,
      optionsHeader
    );
  }

  getNodeNotChildren(): any {
    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    //`${this.nodejsApi}/api/person/getnotchildren`, optionsHeader
    return this.httpClient.get(
      `${this.nodejsApi}/api/person/getnotchildren`,
      optionsHeader
    );
  }

  wedding(id: string, dataWedding: any): any {
    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    return this.httpClient.post(
      `${this.nodejsApi}/api/person/wedding/${id}`,
      dataWedding,
      optionsHeader
    );
  }

  divorce(id: string, idCouple: any): any {
    console.log(localStorage.getItem('token'));

    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    return this.httpClient.post<any>(
      `${this.nodejsApi}/api/person/divorce/${id}`,
      idCouple,
      optionsHeader
    );
  }
}
