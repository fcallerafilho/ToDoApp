import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http : HttpClient) { }

  add(tarefa : any){
    let url = 'http://localhost:17901/api/todo';

      var header = {
        headers: new HttpHeaders()
        .set('Content-Type', `application/json`)
      }

    let param = {nome : tarefa};

    return this.http.post(url, param, header).toPromise();
  }

}
