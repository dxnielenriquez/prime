import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "../share/components/login/login.component";
import {SidebarComponent} from "../share/components/sidebar/sidebar.component";
import {UsersComponent} from "./users/users-list/users.component";
import {authGuard} from "../share/guards/auth.guard";
import {RegistroComponent} from "./registro/registro.component";
import {RolesComponent} from "./roles/roles.component";

const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  },
  {
    path: 'administracion',
    component: SidebarComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'listado-registros',
        component: UsersComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      }
    ]
  },
  {
    path: 'vacantes',
    component: SidebarComponent,
    children: [
      {
        path: 'registro',
        component: RegistroComponent,
      }
    ]
  },
  {path: '**', redirectTo: 'auth/login', pathMatch: 'full'}
];

@NgModule({

  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  bootstrap: [],
})
export class PagesModule {
}
