import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {CommonModule, Location} from "@angular/common";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ModalAlertComponent} from "../../share/components/modals/modal-alert/modal-alert.component";
import {RolesService} from "./roles.service";
import {PrimeNGConfig} from "primeng/api";
import {ModalSolicitudComponent} from "../../share/components/modals/modal-solicitud/modal-solicitud.component";
import {DialogService} from "primeng/dynamicdialog";
import {ModalPermisosComponent} from "../../share/components/modals/modal-permisos/modal-permisos.component";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    ButtonDirective,
    Ripple,
    TableModule,
    CommonModule,
    InputTextModule,
    ModalAlertComponent
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  roles!: any[];
  columns!: any[];
  loading: boolean = true;
  dataSource = ['nombre', 'email', 'role'];

  constructor(
    private _rolesService: RolesService,
    private primeConfig: PrimeNGConfig,
    private _location: Location,
    private dialogService: DialogService) {
    this.primeConfig.ripple = true;
  }

  ngOnInit() {
    this.getRoles();

    this.columns = [
      {field: 'name', header: 'Nombre', width: 70},
    ];

  }

  getRoles() {
    this._rolesService.getRoles().subscribe((res: any) => {
      this.loading = false;
      this.roles = res;
    })
  }

  editarPermiso(data: any){
    this.dialogService.open(ModalPermisosComponent,
      {
        header: 'Permisos del ' + data.name,
        width: '40vw',
        height: '90vh',
        contentStyle: {padding: 0},
        breakpoints: {
          '1100px': '80vw',
          '640px': '90vw'
        },
        data: data.id
      })

  }

  backRoute() {
    this._location.back();
  }

}
