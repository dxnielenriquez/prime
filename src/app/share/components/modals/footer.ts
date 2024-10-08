import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [ButtonModule],
  template:  `
        <div class="flex w-full justify-content-end mt-3">
            <p-button type="button" label="Cerrar" (onClick)="closeDialog({ buttonType: 'Cancel', summary: 'No Product Selected' })" />
        </div> `
})
export class Footer {
  constructor(public ref: DynamicDialogRef) {}

  closeDialog(data: any) {
    this.ref.close(data);
  }
}
