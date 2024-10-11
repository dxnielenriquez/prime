import {Component} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {NgClass} from "@angular/common";
import {DockModule} from "primeng/dock";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {environment} from "../../../../../environments/environment";
import {AvatarModule} from "primeng/avatar";
import {ImageModule} from "primeng/image";

@Component({
  selector: 'app-modal-visualizar',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    NgClass,
    ButtonDirective,
    DockModule,
    AvatarModule,
    ImageModule
  ],
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})
export class ModalDetalleComponent {

  data: any;
  perfil = environment.api.storageUrl + 'imagenes_perfiles/'
  credencial = environment.api.storageUrl + 'imagenes_credenciales/'

  constructor(configDialog: DynamicDialogConfig) {
    this.data = configDialog.data;
  }

}
