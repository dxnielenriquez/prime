import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [Button],
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent implements OnInit {
  errorMessage: string = '';

  constructor(private config: DynamicDialogConfig) { }

  ngOnInit() {
    this.errorMessage = this.config.data?.errorMessage;
  }
}
