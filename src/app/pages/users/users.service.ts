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


  public getEstados() {
    return this._http.get('estados', {
      headers: {noWeb: 'true'}
    });
  }

  public showDetalle(id: any) {
    return this._http.get('visualizar-detalle/' + id);
  }

  public cambiarEstatus(ruta: string, id: number, data: any) {
    return this._http.put(`solicitud/${id}/${ruta}`, data);
  }

  public rechazarSolicitud(id: number) {
    return this._http.get(`solicitud/${id}/rechazar`);
  }

  getCartasRenuncia(): Observable<any> {
    return this._http.get(`cartas-terminacion`, {responseType: 'arraybuffer'})
  }
  getAceptados(): Observable<any> {
    return this._http.get(`contratados/excel`, {responseType: 'arraybuffer'})
  }
  getPagadora(): Observable<any> {
    return this._http.get(`reporte-pagadora`, {responseType: 'blob'})
  }

  getBancos(): Observable<any> {
    return this._http.get('catalogo-bancos');
  }

  getMotivosBaja(): Observable<any> {
    return this._http.get('motivos-baja');
  }


}
