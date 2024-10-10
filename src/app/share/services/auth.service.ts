import { Injectable } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";
export interface Role{
  name : string;
  slug : string;
  id : number;
  permissions: Permissions;
}
export interface User{
  user_id : string;
  login : string;
  nombre: string;
  correo : string;
}
export interface LoginResponse {
  token: string;
  user : User;
  role: Role;
}

interface Permissions {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  login(data: {email: string, password: string}) : Observable<LoginResponse> {

    return this.httpClient
      .post<LoginResponse>('login', data)
      .pipe(
        tap((response: LoginResponse) => this.saveToken(response))
      );
  }

  saveToken(tokenResponse: LoginResponse) {
    localStorage.setItem(environment.api.authTokenName, JSON.stringify(tokenResponse));
  }

  private getStorage(): LoginResponse | null {
    const storage = localStorage.getItem(environment.api.authTokenName);
    return storage ? (JSON.parse(storage) as LoginResponse) : null;
  }

  getToken() : string {
    const token = this.getStorage();
    return token ? token.token : '';
  }

  logout(reload = true) {
    localStorage.removeItem(environment.api.authTokenName);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasAccess(): Observable<boolean> {
    return this.httpClient.get<boolean>('ping', {
      headers: {
        'noIntercept': 'true'
      }
    });
  }

  getUser(): User | null  {
    return this.getStorage()?.user || null;
  }

  getRole(): Role | null  {
    return this.getStorage()?.role || null;
  }

  getPermissions(): Permissions | undefined{
    return this.getStorage()?.role.permissions;
  }
}
