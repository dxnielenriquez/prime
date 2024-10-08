import {Injectable} from '@angular/core';
import {HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private _http: HttpClient,
  ) {
  }


  public getListado() {
    return this._http.get('listado-registro', {
      headers: {noLoading: 'true'}
    });
  }

  public getEstados() {
    return this._http.get('estados', {
      headers: {noWeb: 'true'}
    });
  }

  public showDetalle(id: any) {
    return this._http.get( 'visualizar-detalle/' + id, {
      headers: { noLoading: 'true' }
    });
  }


  public roles(): Observable<any> {
    return this._http.get('usuarios/roles', {
      headers: {noLoading: 'true'}
    });
  }

  public create(body: any): Observable<any> {
    return this._http.post('usuarios', body);

  }

  public show(id: number): Observable<any> {
    return this._http.get(`usuarios/${id}`);
  }


  public update(id: number, body: any): Observable<any> {
    return this._http.put(`usuarios/${id}`, body);
  }

  public delete(id: number): Observable<any> {
    return this._http.delete(`usuarios/${id}`);
  }


}
