import {Component, OnInit} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TreeModule} from "primeng/tree";
import {RolesService} from "../../../../pages/roles/roles.service";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [Button, TreeModule, ButtonDirective, CheckboxModule, FormsModule],
  templateUrl: './modal-permisos.component.html',
  styleUrls: ['./modal-permisos.component.css']
})
export class ModalPermisosComponent implements OnInit {
  data: string = '';
  id: number = 1;
  permisos: any[] = [];


  constructor(
    private config: DynamicDialogConfig,
    private _rolesService: RolesService,
    private messageService: MessageService,
    public ref: DynamicDialogRef
  ) {
    this.id = this.config.data;
  }

  ngOnInit() {
    this.getPermisos();
  }

  getPermisos() {
    this._rolesService.show(this.id).subscribe(res => {
      this.data = res;
      this.permisos = res.flatMap((parent: any) =>
        parent.children
          .filter((permiso: any) => permiso.selected)
          .map((permiso: any) => (permiso.ruta))
      );
    });
  }


  view() {
    const objeto_permisos = this.permisos.reduce((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {});

    const data = {
      'web.ping': true,
      ...objeto_permisos
    };

    this._rolesService.update(this.id, data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Éxito',
          detail: 'La actualización fue un éxito.'
        });
        this.ref.close();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el rol.'
        });
      }
    });
  }
}
