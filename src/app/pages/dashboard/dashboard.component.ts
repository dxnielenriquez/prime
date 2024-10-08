import {Component, OnInit} from '@angular/core';
import {ContextMenuModule} from "primeng/contextmenu";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";

@Component({
  standalone: true,
  imports: [
    ContextMenuModule,
    ButtonDirective,
    Ripple
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  items: any;
  constructor() {
  }

  ngOnInit() {
    this.items = [
      { label: 'Copy', icon: 'pi pi-copy' },
      { label: 'Rename', icon: 'pi pi-file-edit' }
    ];
  }

}
