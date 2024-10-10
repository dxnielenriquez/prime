import {Component, OnInit,} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {StepsModule} from "primeng/steps";
import {Button} from "primeng/button";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {RegistroService} from "./registro.service";
import {MenuItem, MessageService} from "primeng/api";
import {FloatLabelModule} from "primeng/floatlabel";
import {ChipsModule} from "primeng/chips";
import {CalendarModule} from "primeng/calendar";
import {FileUploadModule, UploadEvent} from "primeng/fileupload";
import {CheckboxModule} from "primeng/checkbox";

@Component({
  selector: 'app-registro',
  standalone: true,
  providers: [MessageService],
  imports: [StepsModule, ToastModule, Button, MatStepper, MatStep, ReactiveFormsModule, NgIf, DropdownModule, NgTemplateOutlet, FormsModule, FloatLabelModule, ChipsModule, CalendarModule, FileUploadModule, CheckboxModule, NgClass],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  items: MenuItem[] | undefined;
  active: number = 0;
  vertical = false;
  vacantes = [];
  estados = [];
  municipios = [];
  municipiosSolicitante: any[] = [];
  estadosOrigen = [];
  estadosBeneficiario = [];
  query: any;
  maxDate: any;
  sexo = []
  estadoCivil = []
  parentescos = []
  image: any;
  imageURL: any;
  code = '';
  cv: File | null = null;
  base64textStringProfile: any;
  imageProfile: any;
  imageURLProfile: any;
  selectedImage: string | ArrayBuffer | null = null;
  base64textString: any;
  // selectedImage: any;
  selectedIneImage: string | ArrayBuffer | null = null;
  columnas = [
    {id: 1, nombre: 'A+'},
    {id: 2, nombre: 'A-'},
    {id: 3, nombre: 'B+'},
    {id: 4, nombre: 'B-'},
    {id: 5, nombre: 'AB+'},
    {id: 6, nombre: 'AB-'},
    {id: 7, nombre: 'O+'},
    {id: 8, nombre: 'O-'}
  ];

  form = this._formBuilder.group({
    vacantes: this._formBuilder.group({
      vacante_id: ['', Validators.required],
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],
    }),
    solicitante: this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_paterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_materno: ['', [Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      sexo_id: ['', Validators.required],
      tipo_sangre_id: ['', Validators.required],
      estado_civil_id: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), Validators.pattern(/^([0-9])*$/)]],
      numero_int: ['', [Validators.minLength(1), Validators.maxLength(5), Validators.pattern(/^([0-9])*$/)]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      codigo_postal: ['', [Validators.minLength(5),  Validators.pattern(/^([0-9])*$/)]],
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],

    }),
    beneficiario: this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_paterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      apellido_materno: ['', [Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      parentesco_id: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.minLength(13)]],
      calle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      numero_int: ['', [Validators.minLength(1), Validators.maxLength(5)]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      codigo_postal: ['', [Validators.minLength(5)]],
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],

    }),
    documentacion: this._formBuilder.group({
      clave_ine: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.minLength(18)]],
      rfc: ['', [Validators.required, Validators.minLength(12)]],
      nss: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      cv: ['',]

    }),
  });


  constructor(
    private registroService: RegistroService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.getDateTime();
    this.getEstados();
    this.getSexo();
    this.getEstadoCivil();
    this.getParentesco();
    this.getMunicipiosSolicitante();
    this.getMunicipiosBeneficiario();
  }

  ngOnInit() {
    this.items = [
      {label: 'Vacantes'},
      {label: 'Solicitante'},
      {label: 'Beneficiario'},
      {label: 'Documentación'}
    ];
  }

  getEstados() {
    this.registroService.getEstados().subscribe({
      next: (res) => {
        this.estados = res.estados;
        this.vacantes = res.vacantes;

        if (this.query && (this.query.estado || this.query.vacante)) {
          let estado = this.query.estado;
          let vacante = this.query.vacante;

          let controls = this.form.controls['vacantes'] as FormGroup;

          if (estado) {
            controls.controls['estado_id'].setValue(Number.parseInt(estado));
          }

          if (vacante) {
            controls.controls['vacante_id'].setValue(Number.parseInt(vacante));
          }

          this.getMunicipios();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getMunicipios() {
    let estadoId = this.form.get(`vacantes.estado_id`)?.value;
    let municipio = this.form.get(`vacantes.municipio_id`);

    if (estadoId) {
      this.registroService.getMunicipios(estadoId).subscribe(res => {
        this.municipios = res;
        municipio!.enable();
        municipio!.reset();
      });
    }
  }

  getMunicipiosSolicitante() {
    let estadoIdSolicitante = this.form.get(`solicitante.estado_id`)?.value;
    let municipioSolicitante = this.form.get(`solicitante.municipio_id`);

    if (!estadoIdSolicitante) {
      municipioSolicitante?.disable();
      municipioSolicitante?.reset();
      return;
    }

    this.registroService.getMunicipios(estadoIdSolicitante).subscribe(res => {
      this.municipiosSolicitante = res;
      municipioSolicitante!.enable();
      municipioSolicitante!.reset();
    });
  }
  getMunicipiosBeneficiario() {
    let estadoIdSolicitante = this.form.get(`solicitante.estado_id`)?.value;
    let municipioSolicitante = this.form.get(`solicitante.municipio_id`);

    if (!estadoIdSolicitante) {
      municipioSolicitante?.disable();
      municipioSolicitante?.reset();
      return;
    }

    this.registroService.getMunicipios(estadoIdSolicitante).subscribe(res => {
      this.municipiosSolicitante = res;
      municipioSolicitante!.enable();
      municipioSolicitante!.reset();
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

  onVacanteChange(event: any): void {

  }

  getUrl(imageProfile: any, imageURLProfile: any, def: any) {
    return (imageProfile) ? imageProfile : (imageURLProfile) ? imageURLProfile : def;
  }

  pdfSubmit(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const fileSizeInMB: number = file.size / (1024 * 1024);

      if (fileSizeInMB <= 1) {
        this.cv = file;
      } else {

        event.target.value = null;
        this.cv = null;
      }
    } else {
      this.cv = null;
    }
  }


  readerLoadedProfile(readerEvt: any) {
    this.base64textStringProfile = readerEvt.target.result;
  }

  imageSubmitProfile(event: any) {
    let files = event.target.files;
    let file = files[0];

    if (!file) return;

    if (file.size > 5000000) {
      console.log('error');
      this.messageService.add({
        severity: 'error',
        summary: 'Alto',
        detail: 'Imagen demasiado grande.'
      });
      return;
    }

    if (files && file) {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.selectedImage = reader.result;
      };
      reader.onload = this.readerLoadedProfile.bind(this);
      reader.readAsDataURL(file);
    }

    let archivoInput = event.target as HTMLInputElement;
    archivoInput.value = '';
    console.log(archivoInput);
  }

  imageSubmit(event: any) {
    let files = event.target.files;
    let file = files[0];

    if (!file) return;

    if (file.size > 5000000) {
      console.log('error');
      this.messageService.add({
        severity: 'error',
        summary: 'Alto',
        detail: 'Imagen demasiado grande.'
      });
      return;
    }

    if (files && file) {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.selectedIneImage = reader.result;
      };
      reader.onload = this.readerLoaded.bind(this);
      reader.readAsDataURL(file);
    }

    let archivoInput = event.target as HTMLInputElement;
    archivoInput.value = '';
    console.log(archivoInput);
  }
  readerLoaded(readerEvt: any) {
    this.base64textString = readerEvt.target.result;
  }

  onSubmit() {

    let controls = this.form['controls']
    if (controls) {
      console.log(controls);
    }

  }

}
