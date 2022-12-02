import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class NodeService {
  // get url backend from env config
  nodejsApi: string = environment.nodejsApi;
  // token: string =  || '';

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
  

  deleteNode(query: string): any {
    // let optionsHeader = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: localStorage.getItem('token') || '',
    //   }),
    // };
    return this.httpClient.put<any>(
      `${this.nodejsApi}/api/node/deleteNode/${query}`,
      'delete node'
      // optionsHeader
    );
  }

  addNode(data: any): any {
    return this.httpClient.post<any>(
      `${this.nodejsApi}/api/person/create`,
      data
    );
  }
  updateNode(data: any, query: string): any {
    return this.httpClient.put<any>(
      `${this.nodejsApi}/api/person/update/${query}`,
      data
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

  addNodeChildren(params: string, parent: string): any {
    let optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token') || '',
      }),
    };
    return this.httpClient.put<any>(
      `${this.nodejsApi}/api/node/addNodeChildren/${params}`,
      { parent: parent },
      optionsHeader
    );
  }
}
