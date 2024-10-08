import { Component } from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {NgClass} from "@angular/common";
import {DockModule} from "primeng/dock";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {environment} from "../../../../../environments/environment.development";

@Component({
  selector: 'app-modal-visualizar',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    NgClass,
    ButtonDirective,
    DockModule
  ],
  templateUrl: './modal-visualizar.component.html',
  styleUrls: ['./modal-visualizar.component.css']
})
export class ModalVisualizarComponent {

  datos: any;
  perfil = environment.api.storageUrl + 'imagenes_perfiles/'
  credencial = environment.api.storageUrl + 'imagenes_credenciales/'

  constructor(private configDialog: DynamicDialogConfig) {
    console.log(configDialog)
    this.datos = configDialog.data;
  }

}
