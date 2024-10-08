import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {NgbModalModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "./material/material.module";
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [

  ],
  imports: [
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    NgOptimizedImage,
    CommonModule,
    Button,
    DialogModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    FlatpickrModule,
    ReactiveFormsModule,
    CalendarModule,
    NgbModule,
    NgbModalModule,
    NgxMaskDirective,
    MaterialModule,
    NgxMaskPipe,
    NgOptimizedImage
  ],
  providers: [
    provideNgxMask(),
    DatePipe
  ]
})
export class ShareModule {
}
