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
import {Router, RouterLink} from "@angular/router";
import {ModalAlertComponent} from "../../../share/components/modals/modal-alert/modal-alert.component";
import {MatTooltip} from "@angular/material/tooltip";
import {TooltipModule} from "primeng/tooltip";
import {LoadingService} from "../../../share/services/loading.service";
import {NgxPermissionsModule} from "ngx-permissions";
import {DropdownModule} from "primeng/dropdown";
import {DialogService} from "primeng/dynamicdialog";
import {FooterEditComponent} from "../../../share/components/modals/footer-edit.component";
import {CalendarModule} from "primeng/calendar";
import {FloatLabelModule} from "primeng/floatlabel";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ModalDetalleComponent} from "../../../share/components/modals/modal-detalle/modal-detalle.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalVisualizarComponent} from "../../../share/components/modals/modal-visualizar/modal-visualizar.component";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../share/services/auth.service";
import {ModalSolicitudComponent} from "../../../share/components/modals/modal-solicitud/modal-solicitud.component";
import {EstatusVacante} from "../../../share/enums/estatus-vacante";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, ButtonDirective, PasswordModule, FormsModule, Button, Ripple, RouterLink, ModalAlertComponent, MatTooltip, TooltipModule, NgxPermissionsModule, DropdownModule, CalendarModule, FloatLabelModule, TieredMenuModule],
  providers: [LoadingService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users!: any[];
  columns!: any[];
  loading: boolean = true;
  searchValue: string | undefined
  estatusVacante = EstatusVacante;
  dataSource = ['fecha_registro', 'vacante', 'estado', 'nombre', 'estado_origen', 'clave_ine', 'estatus', 'procesado'];
  estados: [{nombre: string, campo: string}] = [{'nombre': 'Todos los estatus', 'campo': ' '}];
  vacantes: [{descripcion: string, campo: string}] = [{'descripcion': 'Todos los estatus', 'campo': ' '}];
  rangeDates: Date[] = [];
  itemsDoc = [
    {
      label: 'Curriculum',
      icon: 'pi pi-file-pdf',
      id: 'curriculum'
    },
    {
      label: 'Constancia de situación fiscal',
      icon: 'pi pi-file-pdf',
      id: 'constancia'
    },
    {separator: true},
    {
      label: 'Documentos Informática Electoral',
      icon: 'pi pi-file-pdf',
      id: 'documentosIE',
      items: [
        {
          label: 'Carta compromiso',
          id: 'cartaIE',
          icon: 'pi pi-plus'
        },
        {
          label: 'Periodo de prueba',
          id: 'pruebaIE',
          icon: 'pi pi-folder-open'
        },
        {
          label: 'Convenio de confidencialidad',
          id: 'convenioIE',
          icon: 'pi pi-print'
        },
        {
          label: 'Delitos Electorales',
          id: 'delitosIE',
          icon: 'pi pi-folder-open'
        },
        {
          label: 'Contrato',
          id: 'contratoIE',
          icon: 'pi pi-folder-open'
        },
        {
          label: 'Carta de renuncia',
          id: 'renunciaIE',
          icon: 'pi pi-folder-open'
        },
      ]
    },
    {
      label: 'Documentos General',
      icon: 'pi pi-file-pdf',
      id: 'documentosG',
      items: [
        {
          label: 'Periodo de prueba',
          id: 'pruebaG',
          icon: 'pi pi-times'
        },
        {
          label: 'Carta de renuncia',
          id: 'renunciaG',
          icon: 'pi pi-folder-open'
        },
      ]
    }
  ]
  itemsSolicitud = [
    {
      label: 'Aceptar solicitud',
      id: 'aceptar'
    },
    {
      label: 'Rechazar solicitud',
      id: 'rechazar'
    },
    {
      label: 'Editar fecha de contrato',
      id: 'editar_fecha',
    },
    {
      label: 'Dar de baja',
      id: 'dar_baja',
    }
  ]

  estatus = [
    {'nombre': 'Todos los estatus', 'campo': ' '},
    {'nombre': 'Pendientes', 'campo': 'pendiente'},
    {'nombre': 'Rechazados', 'campo': 'rechazado'},
    {'nombre': 'Aceptados', 'campo': 'aceptado'},
    {'nombre': 'Baja', 'campo': 'baja'},
  ];


  constructor(
    private _userService: UsersService,
    private primeConfig: PrimeNGConfig,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _router: Router) {

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
      this.estados.unshift({'nombre': 'Todos los estados', 'campo': ' '})
      this.vacantes.unshift({'descripcion': 'Todas las vacantes', 'campo': ' '})
    });
  }

  mostrarDetalle(id: number) {

    this._userService.showDetalle(id).subscribe(res => {

      this.dialogService.open(ModalDetalleComponent,
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

  mostrarPDF(tipo: number, id: number, uri: string, nombre: string) {

    const token = this.authService.getToken();
    const ruta = `${environment.api.baseUrl}/${uri}/${tipo}/${id}?token=${token}`;
    let url = this.domSanitizer.bypassSecurityTrustResourceUrl(ruta);
    this.dialogService.open(ModalVisualizarComponent,
      {
        header: nombre,
        width: '79vw',
        height: '90vh',
        contentStyle: {padding: 0},
        breakpoints: {
          '991px': '80vw',
          '640px': '90vw'
        },
        maximizable: true,
        data: url
      })
  }

  cambiarEstatus(data: any, ruta: string) {

    if (ruta == 'rechazar') {
      this.confirmationService.confirm({
        message: `¿Está seguro que desea RECHAZAR la solicitud?`,
        header: 'Confirmación',
        acceptIcon: "none",
        acceptLabel: 'Sí',
        rejectIcon: "none",
        rejectLabel: 'No',
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this._userService.rechazarSolicitud(data.id).subscribe((res: any) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Éxito',
              detail: 'La solicitud fue rechazada.'
            });
            this.getRegistros();
          })
        }
      });
    } else {
      const dialog = this.dialogService.open(ModalSolicitudComponent,
        {
          header: 'Datos',
          width: '40vw',
          height: '65vh',
          contentStyle: {padding: 0},
          breakpoints: {
            '991px': '80vw',
            '640px': '90vw'
          },
          maximizable: true,
          data: {
            info: data,
            ruta: ruta,
          }
        })

      dialog.onClose.subscribe(_ => {
        this.getRegistros();
      })
    }

  }

  event(ev: any) {
    return ev.value;
  }

  clearTable(table: Table) {
    table.clear();
    this.searchValue = '';
    this.rangeDates = [];
    this.getRegistros();
  }

  descargarTerminados() {
    this._userService.getCartasRenuncia().subscribe({
      next: (res) => {
        const blob = new Blob([res], {
          type: 'application/zip'
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url)
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se cuentan con cartas de renuncia.'
        });
      }
    });
  }

  descargarAceptados() {
    this._userService.getAceptados().subscribe({
      next: (res) => {
        const blob = new Blob([res], {
          type: 'application/zip',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url)
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al obtener el archivo.'
        });
      }
    });
  }

  formatoFecha(fecha: Date): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  permisos() {
    this._router.navigate(['/administracion/roles']);
  }
}
