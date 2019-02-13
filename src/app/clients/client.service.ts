import { Injectable } from '@angular/core';
import { DatePipe  } from '@angular/common';
import { Client } from './client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class ClientService {
  private urlEndPoint = 'http://localhost:8081/api/clients';
  private httpHeadders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }

  getClients(): Observable<Client[]> {
    return this.http.get(this.urlEndPoint).pipe(
      tap( response => {
        let clients = response as Client[];
        clients.forEach(c=>{
          console.log(c);
        })
      }, err => console.log(err), () => console.log('Complete')),
      map(response => {
        return (response as Client[]).map(c => {
          c.name = c.name.toUpperCase();
          // c.createAt = new DatePipe('es-CL').transform(c.createAt, 'fullDate');
          // c.createAt = new DatePipe('en-US').transform(c.createAt, 'EEEE dd, MMMM yyyy');
          return c;
        });
      })
    );
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.urlEndPoint, client, {headers: this.httpHeadders}).pipe(
      map( (response: any) => response.client as Client),
      catchError( e => {
        if (e.status === 400) {
          return throwError(e);
        }
        swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
}

  getClient(id): Observable <Client> {
    return this.http.get<Client>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clients']);
        swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update (client: Client): Observable <Client> {
    return this.http.put<Client>(`${this.urlEndPoint}/${client.id}`, client, {headers: this.httpHeadders}).pipe(
      map( (response: any) => response.client as Client),
      catchError( e => {

        if (e.status === 400) {
          return throwError(e);
        }

        swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeadders}).pipe(
      catchError( e => {
        swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
