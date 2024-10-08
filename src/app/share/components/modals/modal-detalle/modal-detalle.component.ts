import {Component} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-modal-detalle',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})
export class ModalDetalleComponent {
  visible: boolean = false;
  loadingVisible: boolean = false;

  showDialog() {
    this.loadingVisible = true;
    setTimeout(() => {
      this.loadingVisible = false;
      this.visible = true;
    }, 5000);
  }
}
