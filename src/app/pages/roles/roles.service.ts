import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private _http: HttpClient) { }

  public getRoles(): Observable<any> {

    return this._http.get(`roles`, {
      headers: {noLoading: 'true'}
    });
  }

  public update(id: number, data: any): Observable<any> {

    return this._http.put(`roles/${id}`, data);
  }

  public show(id: number): Observable<any> {

    return this._http.get(`roles/${id}`);
  }
}
