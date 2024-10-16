import {Component, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {LoadingComponent} from "../share/components/loading/loading.component";
import {NgxPermissionsService} from "ngx-permissions";
import {AuthService} from "../share/services/auth.service";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, LoadingComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {


  constructor(private permissionsService: NgxPermissionsService,
              private _authService: AuthService) {
  }

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos() {
    const perms = this._authService.getPermissions();
    if (perms) {
      this.permissionsService.flushPermissions();
      Object.keys(perms).forEach(key => {
        if (perms[key]) {
          this.permissionsService.addPermission(key);
        }
      });
    }
  }
}
