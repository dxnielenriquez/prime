import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {UsersService} from "../../../../pages/users/users.service";
import {MessageService} from "primeng/api";
import {DynamicDialogConfig} from "primeng/dynamicdialog";

@Component({
  selector: 'app-modal-reporte-pagadora',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './modal-reporte-pagadora.component.html',
  styleUrl: './modal-reporte-pagadora.component.css'
})
export class ModalReportePagadoraComponent {

  data: any;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  constructor(
    private _userService: UsersService,
    private messageService: MessageService,
    confidDialog: DynamicDialogConfig
  ) {
    this.data = confidDialog.data
  }

  descargarPagadora() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor selecciona ambas fechas.'
      });
      return;
    }

    const fechaIniFormatted = this.formatoFecha(this.fechaInicio, true); // Formato YYYY-MM-DD
    const fechaFinFormatted = this.formatoFecha(this.fechaFin, true);   // Formato YYYY-MM-DD

    console.log(fechaFinFormatted);
    console.log(fechaIniFormatted);

    this._userService.getPagadoraFechas(fechaIniFormatted, fechaFinFormatted).subscribe({
      next: (res) => {
        if (res instanceof Blob) {
          const blobData = new Blob([res], { type: 'application/vnd.ms-excel' });
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blobData);
          downloadLink.setAttribute('download', `ALTAS-PAGADORA-${this.data}.xls`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El formato del archivo no es válido.'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al descargar el reporte de la pagadora.'
        });
      }
    });
  }

  formatoFecha(fecha: Date, Ymd = true): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return Ymd ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
  }
}

