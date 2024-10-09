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
    const id = this.dataDialog.data.id
    let utf8Encode = new TextEncoder();
    let encoded = utf8Encode.encode(id)
    let bArrHex = this.tohex(encoded);
    let str = CryptoJS.enc.Hex.parse(bArrHex.toString())
    let encrypted = CryptoJS.AES.encrypt(str, this.pwd);
    const url = this.router.createUrlTree(['/vacantes/registro'], {
      relativeTo: this.activatedRoute,
      queryParams: {id: encrypted.toString()}
    })

    window.open(url.toString(), '_blank')
  }

  tohex(unsignedByteArray: string | any[] | Uint8Array) {
    let hex = "";
    for (let i = 0; i < unsignedByteArray.length; i++) {
      let c = unsignedByteArray[i];
      if (c < 0 || c > 255) {
        throw "Value not an unsigned byte in array";
      }
      let h = c.toString();
      if (h.length == 1) {
        hex += "0" + h;
      } else {
        hex += h;
      }
    }
    return hex;
  }
}
