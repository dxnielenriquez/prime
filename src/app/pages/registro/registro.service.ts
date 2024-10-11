import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private url = '';

  constructor(
    private _http: HttpClient,
  ) {
  }

  public getFecha(): Observable<any> {
    return this._http.get('fecha', {
      headers: {noWeb: 'true'}
    })
  }

  public getEstados(): Observable<any> {
    return this._http.get('estados', {
      headers: {noWeb: 'true'}
    })
  }

  public getSexo(): Observable<any> {
    return this._http.get('sexo', {
      headers: {noWeb: 'true'}
    })
  }

  public getEstadoCivil(): Observable<any> {
    return this._http.get('estado-civil', {
      headers: {noWeb: 'true'}
    })
  }

  public getParentezco(): Observable<any> {
    return this._http.get('parentescos', {
      headers: {noWeb: 'true'}
    })
  }

  public getMunicipios(id: any): Observable<any> {
    return this._http.get(`municipios/${id}`, {
      headers: {noWeb: 'true'}
    })
  }

  public crearRegistro(body: any): Observable<any> {
    return this._http.post('registro', body, {
      headers: {noWeb: 'true'}
    })
  }

  public actualizarRegistro(id: any, body: any): Observable<any> {
    return this._http.put(`registro/${id}`, body, {
      headers: {noWeb: 'true'}

    })
  }

  public show(id: any): Observable<any> {
    return this._http.get(`registro/${id}`, {
      headers: {noWeb: 'true'}
    })

  }

  public sendIne(cv: any, clave_ine: any): Observable<any> {
    return this._http.post(`enviar-cv?clave_ine=${clave_ine}`, cv, {
      headers: {noWeb: 'true'}
    })
  }


}
