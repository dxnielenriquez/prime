import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {ImageModule} from "primeng/image";
import {CommonModule, NgSwitchCase} from "@angular/common";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {UsersService} from "../../../../pages/users/users.service";
import {MessageService} from "primeng/api";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-modal-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ImageModule,
    NgSwitchCase,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    InputTextareaModule
  ],
  templateUrl: './modal-solicitud.component.html',
  styleUrl: './modal-solicitud.component.css'
})
export class ModalSolicitudComponent implements OnInit {

  data: any;
  bancos: any = [];
  motivos: any = [];
  form: FormGroup = this._fb.group({});

  constructor(
    config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private userService: UsersService,
    private messageService: MessageService,
    public ref: DynamicDialogRef
  ) {
    this.data = config.data;
  }

  ngOnInit(): void {
    switch (this.data.ruta) {
      case 'aceptar':
        this.form = this._fb.group({
          banco_id: ['', Validators.required],
          fecha_inicio: ['', Validators.required],
          numero_cuenta: ['', [Validators.maxLength(24)]],
          clabe: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
          tarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
        });
        this.userService.getBancos().subscribe(res => {
          this.bancos = res;
        });
        break;
      case 'actualizar-inicio':
        this.form = this._fb.group({
          fecha_inicio: ['', Validators.required],
        })
        break;
      case 'baja':
        this.form = this._fb.group({
          fecha_termino: ['', Validators.required],
          motivo_baja_id: ['', Validators.required],
          recontratable: [0],
          observaciones: ['', [Validators.required, Validators.maxLength(191)]]
        })
        this.userService.getMotivosBaja().subscribe(res => {
          this.motivos = res;
        });
        break;
    }

  }

  isControlHasError(controlName: string, validationType: string): boolean {
    let control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty);
  }

  onSubmit() {
    let controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsDirty()
      );
      return;
    }
    let value = this.form.value;

    this.userService.cambiarEstatus(this.data.ruta, this.data.info.id, value).subscribe(_ => {
      this.messageService.add({
        severity: 'info',
        summary: 'Éxito',
        detail: 'La actualización fue un éxito.'
      });
      this.ref.close();
    });
  }

}
