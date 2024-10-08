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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, ButtonDirective, PasswordModule, FormsModule, Button, Ripple, RouterLink, ModalAlertComponent, MatTooltip, TooltipModule, NgxPermissionsModule],
  providers: [ConfirmationService, MessageService, LoadingService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users!: any[];
  columns!: any[];
  loading: boolean = true;
  searchValue: string | undefined
  filterHidden = true;
  dataSource = ['nombre', 'email', 'role'];
  deleted = false;

  constructor(
    private _userService: UsersService,
    private primeConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _loading: LoadingService) {
    this.primeConfig.ripple = true;
  }

  ngOnInit() {
    this.getUser();

    this.columns = [
      {field: 'nombre', header: 'Nombre', width: 30},
      {field: 'email', header: 'Correo', width: 30},
      {field: 'role', header: 'Rol', width: 30},
    ];

  }

  getUser() {
    this._userService.getUsers(this.deleted).subscribe((res: any) => {
      this.loading = false;
      this.users = res.data;
    })
  }

  event(ev: any) {
    return ev.value;
  }

  clearTable(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  getDeletedUsers() {
    this.deleted = !this.deleted;
    this.getUser();
  }

  delete(event: Event, user: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de eliminar el usuario ' + user.nombre + '?',
      header: 'Eliminar Usuario',
      acceptButtonStyleClass: "p-button-text p-button-text",
      rejectButtonStyleClass: "p-button-danger p-button-text",
      acceptLabel: "Sí",

      accept: () => {
        this._userService.delete(user.id)
          .subscribe({
            next: any => {
              this.messageService.add({
                severity: 'info',
                summary: 'Eliminado',
                detail: 'El usuario ha sido eliminado con éxito.'
              });
              this.getUser();
            },
            error: any => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al eliminar el usuario.'
              });
            }

          });
      }
    });
  }

}
