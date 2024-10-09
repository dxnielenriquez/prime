import {Component, inject, OnInit, } from '@angular/core';
import {ToastModule} from "primeng/toast";
import {StepsModule} from "primeng/steps";
import {Button} from "primeng/button";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {
  FormBuilder, FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {RegistroService} from "./registro.service";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [StepsModule, ToastModule, Button, MatStepper, MatStep, ReactiveFormsModule, NgIf, DropdownModule, NgTemplateOutlet, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;


  vertical = false;
  form: UntypedFormGroup = new UntypedFormGroup({});
  aviso: UntypedFormControl | undefined;
  beneficiarioForm: UntypedFormGroup = new UntypedFormGroup({});
  vacantes = [];
  selectedVacante: any;
  selectedEstado: any;
  selectedMunicipio: any;
  estados = [];
  estadosOrigen = [];
  estadosBeneficiario = [];
  splashScreenDialog: any
  query: any;
  maxDate: any;
  sexo = []
  estadoCivil = []
  parentescos = []
  municipios = [];


  constructor(
    private fb: UntypedFormBuilder,
    private registroService: RegistroService
  ) {
    this.getDateTime()
    this.getEstados();
    this.getSexo();
    this.getEstadoCivil();
    this.getParentesco();

  }

  ngOnInit() {
    this.crearFormulario();

  }

  onVacanteChange(event: any): void {
  }

  crearFormulario() {
    this.aviso = new UntypedFormControl(false, Validators.required);
    this.form = this.fb.group({
      vacante_id: ['', Validators.required],
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_paterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128),  Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_materno: ['', [ Validators.minLength(3), Validators.maxLength(128),  Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      estado_origen_id: ['', Validators.required],
      municipio_origen_id: ['', Validators.required],
      estado_civil_id: ['', Validators.required],
      sexo_id: ['', Validators.required],
      tipo_sangre_id: ['', Validators.required],
      telefono: ['', [Validators.required,  Validators.minLength(10), Validators.maxLength(10)]],
      correo: ['', [Validators.required, Validators.email]],
      calle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5),  Validators.pattern(/^([0-9])*$/)]],
      numero_int: ['', [ Validators.minLength(1), Validators.maxLength(5),  Validators.pattern(/^([0-9])*$/)]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      codigo_postal: ['', [ Validators.minLength(5),  Validators.pattern(/^([0-9])*$/)]],
      fecha_nacimiento: ['', [Validators.required]],
      rfc: ['', [Validators.required, Validators.minLength(12)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.minLength(18),]],
      nss: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), ]],
      clave_ine: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18),]],
      cv: ['', ]
      // foto: ['', [Validators.required]]
    });

    this.beneficiarioForm = this.fb.group({
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],
      // nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), NoSpaces, Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128),  Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],

      apellido_paterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128),  Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_materno: ['', [ Validators.minLength(3), Validators.maxLength(128),  Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      telefono: ['', [Validators.required,  Validators.minLength(10), Validators.maxLength(10)]],
      parentesco_id: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.minLength(13)]],
      calle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ]],
      numero_int: ['', [ Validators.minLength(1), Validators.maxLength(5), ]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), ]],
      codigo_postal: ['', [ Validators.minLength(5)]],
    });
  }



  vacanteCompleted() {
    let controls = this.form.controls
    return controls['vacante_id'].valid && controls['estado_id'].valid && controls['municipio_id'].valid
  }


  isControlValid(controlName: string): boolean {
    let control = this.form.controls[controlName];
    if (!control) {
      return false;
    } else if (control.valid) {
      return false;
    }
    return true;
  }

  isControlHasError(controlName: string, validationType: string) {
    let control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }


  getEstados() {
    this.registroService.getEstados().subscribe((res) => {
      this.estados = res.estados;
      this.vacantes = res.vacantes;
      this.estadosOrigen = res.estados_origen;
      this.estadosBeneficiario = res.estados_origen;
      this.splashScreenDialog.close();

      if (this.query.estado || this.query.vacante) {
        let estado = this.query.estado;
        let vacante = this.query.vacante;

        let controls = this.form.controls;
        controls['estado_id'].setValue(Number.parseInt(estado));
        controls['vacante_id'].setValue(Number.parseInt(vacante));
        this.getMunicipios();
      }

    }, () => {
      this.splashScreenDialog.close();
    });
  }

  getMunicipios() {
    let values = this.form.value;
    let municipio = this.form.get('municipio_id');
    municipio!.disable();
    this.registroService.getMunicipios(values.estado_id).subscribe(res => {
      this.municipios = res.municipios;
      municipio!.enable();
      municipio!.reset();
    });
  }

  getDateTime() {
    this.registroService.getFecha().subscribe(res => {
      //let fechaTemp = res.fecha.split('-')
      let fechaEleccion = res.fecha_eleccion.split('-')

      this.maxDate = new Date(fechaEleccion[0] - 18, (fechaEleccion[1] - 1), fechaEleccion[2]);
    })
  }

  getSexo() {
    this.registroService.getSexo().subscribe(res => {
      this.sexo = res;
    })
  }

  getEstadoCivil() {
    this.registroService.getEstadoCivil().subscribe(res => {
      this.estadoCivil = res;
    })
  }

  getParentesco() {
    this.registroService.getParentezco().subscribe(res => {
      this.parentescos = res;
    })
  }


}
