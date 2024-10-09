import {Component, OnInit} from '@angular/core';
import {Table, TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Button, ButtonDirective} from "primeng/button";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {UsersService} from "../users.service";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {RouterLink} from "@angular/router";
import {ModalAlertComponent} from "../../../share/components/modals/modal-alert/modal-alert.component";
import {MatTooltip} from "@angular/material/tooltip";
import {TooltipModule} from "primeng/tooltip";
import {LoadingService} from "../../../share/services/loading.service";
import {NgxPermissionsModule} from "ngx-permissions";
import {DropdownModule} from "primeng/dropdown";
import {DialogService} from "primeng/dynamicdialog";
import {ModalVisualizarComponent} from "../../../share/components/modals/modal-visualizar/modal-visualizar.component";
import {FooterEditComponent} from "../../../share/components/modals/footer-edit.component";
import {CalendarModule} from "primeng/calendar";
import {FloatLabelModule} from "primeng/floatlabel";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, ButtonDirective, PasswordModule, FormsModule, Button, Ripple, RouterLink, ModalAlertComponent, MatTooltip, TooltipModule, NgxPermissionsModule, DropdownModule, CalendarModule, FloatLabelModule],
  providers: [ConfirmationService, MessageService, LoadingService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users!: any[];
  columns!: any[];
  loading: boolean = true;
  searchValue: string | undefined
  dataSource = ['fecha_registro', 'vacante', 'estado', 'nombre', 'estado_origen', 'clave_ine', 'estatus', 'procesado'];
  estados: any = [];
  vacantes: any = [];
  rangeDates: Date[] = [];
  estatus = [
    {'nombre': 'Todos los estatus', 'campo': ''},
    {'nombre': 'Pendientes', 'campo': 'Pendiente'},
    {'nombre': 'Rechazados', 'campo': 'Rechazado'},
    {'nombre': 'Aceptados', 'campo': 'Aceptado'},
    {'nombre': 'Baja', 'campo': 'Baja'},
  ];
  constructor(
    private _userService: UsersService,
    private primeConfig: PrimeNGConfig,
    private dialogService: DialogService) {
    this.primeConfig.ripple = true;
    this.getEstados();
  }


  ngOnInit() {
    this.getRegistros();

    this.columns = [
      {filterType: 'date', field: 'fecha_registro', header: 'Fecha de registro', width: 11},
      {field: 'vacante', header: 'Vacante', width: 11},
      {field: 'estado', header: 'Ubicacion', width: 11},
      {filterType: 'text', field: 'nombre', header: 'Nombre', width: 11},
      {field: 'estado_origen', header: 'Estado de origen', width: 11},
      {field: 'clave_ine', header: 'Clave de elector', width: 11},
      {field: 'estatus', header: 'Estatus', width: 11},
      {field: 'procesado', header: 'Procesado por', width: 11},
    ];

  }

  getRegistros() {

    const fecha_ini = this.formatoFecha(this.rangeDates[0]);
    const fecha_fin = this.formatoFecha(this.rangeDates[1]);

    this._userService.getListado(fecha_ini, fecha_fin).subscribe((res: any) => {
      this.loading = false;
      this.users = res;
    })
  }

  getEstados() {
    this._userService.getEstados().subscribe((res: any) => {
      this.estados = res.estados;
      this.vacantes = res.vacantes;
    });
    this.estados.unshift({'nombre': ''})
    this.estados.unshift({'descripcion': ''})
  }

  mostrarDetalle(id: number) {

    this._userService.showDetalle(id).subscribe(res => {
      this.dialogService.open(ModalVisualizarComponent,
        {
          header: 'Registro',
          width: '75vw',
          height: '75vh',
          contentStyle: {overflow: 'auto'},
          breakpoints: {
            '991px': '80vw',
            '640px': '90vw'
          },
          maximizable: true,
          templates: {
            footer: FooterEditComponent
          },
          data: res
        })
    });
  }


  event(ev: any) {
    return ev.value;
  }

  clearTable(table: Table) {
    table.clear();
    this.searchValue = '';
  }


  formatoFecha(fecha: Date): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
