import {Component} from '@angular/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule],
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent {

}
