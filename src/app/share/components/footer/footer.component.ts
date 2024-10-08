import { Component } from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {PanelModule} from "primeng/panel";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MenubarModule, PanelModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  anio: number = new Date().getFullYear();
}
