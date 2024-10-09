import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private _http: HttpClient,
  ) {
  }


  public getListado(fecha_ini: string, fecha_fin: string) {
    let params = new HttpParams();
    (fecha_ini) ? params = params.append('fecha_ini', fecha_ini) : '';
    (fecha_fin) ? params = params.append('fecha_fin', fecha_fin) : '';

    return this._http.get('listado-registro', {params: params});
  }

  public getEstados() {
    return this._http.get('estados', {
      headers: {noWeb: 'true'}
    });
  }

  public showDetalle(id: any) {
    return this._http.get('visualizar-detalle/' + id, {
      headers: {noLoading: 'true'}
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
