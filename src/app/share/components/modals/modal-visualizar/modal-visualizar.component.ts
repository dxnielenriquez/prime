import {Component, OnInit} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {NgClass, NgIf} from "@angular/common";
import {DockModule} from "primeng/dock";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
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
    ImageModule,
    NgIf
  ],
  templateUrl: './modal-visualizar.component.html',
  styleUrls: ['./modal-visualizar.component.css']
})
export class ModalVisualizarComponent implements OnInit {

  data: any;
  loading = true;

  constructor(configDialog: DynamicDialogConfig) {
    this.data = configDialog.data;
  }

  ngOnInit(): void {
    const iframe = document.getElementById("pdfFrame") as HTMLIFrameElement;
    if (iframe) {
      iframe.addEventListener("load", () => {
        this.loading = false;
      });
    }
  }


}

