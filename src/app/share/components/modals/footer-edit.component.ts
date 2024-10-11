import {Component} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import * as CryptoJS from 'crypto-js';
import {environment} from "../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'footer',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="flex w-full justify-content-end mt-3">
      <p-button type="button" label="Editar" (onClick)="abrir()"/>
    </div> `
})
export class FooterEditComponent {
  pwd = environment.api.PW

  constructor(private dataDialog: DynamicDialogConfig,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  abrir() {
    const id = this.dataDialog.data.id;

    try {
      const utf8Encode = new TextEncoder();
      const encoded = utf8Encode.encode(id);
      const bArrHex = this.tohex(encoded);
      const str = CryptoJS.enc.Hex.parse(bArrHex);
      const encrypted = CryptoJS.AES.encrypt(str, this.pwd).toString();
      console.log(encoded)
      console.log(bArrHex)
      console.log(str)
      console.log(encrypted)
      const url = this.router.createUrlTree(['/vacantes/registro'], {
        relativeTo: this.activatedRoute,
        queryParams: {id: encrypted},
      });

      window.open(url.toString(), '_blank');
    } catch (error) {
      console.error('Error during encryption:', error);
    }
  }

  tohex(unsignedByteArray: Uint8Array) {
    return Array.from(unsignedByteArray)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
