import {Component, OnInit,} from '@angular/core';
import {ToastModule} from "primeng/toast";
import {StepsModule} from "primeng/steps";
import {Button} from "primeng/button";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {RegistroService} from "./registro.service";
import {MenuItem, MessageService} from "primeng/api";
import {FloatLabelModule} from "primeng/floatlabel";
import {ChipsModule} from "primeng/chips";
import {CalendarModule} from "primeng/calendar";
import {FileUploadModule} from "primeng/fileupload";
import {CheckboxModule} from "primeng/checkbox";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment.development";
import {ModalVisualizarComponent} from "../../share/components/modals/modal-visualizar/modal-visualizar.component";
import {DialogService} from "primeng/dynamicdialog";
import {DomSanitizer} from "@angular/platform-browser";
import {TabViewModule} from "primeng/tabview";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [StepsModule, ToastModule, Button, MatStepper, MatStep, ReactiveFormsModule, NgIf, DropdownModule, NgTemplateOutlet, FormsModule, FloatLabelModule, ChipsModule, CalendarModule, FileUploadModule, CheckboxModule, NgClass, TabViewModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  items: MenuItem[] | undefined;
  active: number = 3;
  vertical = false;
  vacantes = [];
  estados = [];
  municipios = [];
  municipiosSolicitante: any[] = [];
  municipiosBeneficiario: any[] = [];
  municipiosConstancia: any[] = [];
  estadosOrigen = [];
  estadosBeneficiario = [];
  estadosConstancia = [];
  query: any;
  maxDate: any;
  sexo = []
  estadoCivil = []
  parentescos = []
  image: any;
  imageURL: any;
  code = '';
  cv: File | null = null;
  constanciaFiscal: File | null = null;
  base64textStringProfile: any;
  imageProfile: any;
  imageURLProfile: any;
  selectedImage: string | ArrayBuffer | null = null;
  base64textString: any;
  nuevoRegistro = true;
  storage = environment.api.storageUrl
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
      codigo_postal: ['', [Validators.minLength(5), Validators.pattern(/^([0-9])*$/)]],
      estado_origen_id: ['', Validators.required],
      municipio_origen_id: [{value: '', disabled: true}, Validators.required],
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
      usarDomicilio: [false],


    }),
    documentacion: this._formBuilder.group({
      clave_ine: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.minLength(18)]],
      rfc: ['', [Validators.required, Validators.minLength(12)]],
      nss: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      codigo_postal_constancia: ['', Validators.required],
      estado_id_constancia: ['', Validators.required],
      municipio_id_constancia: [{value: '', disabled: true}, Validators.required],
      aviso: [false, Validators.required,]

    }),
  });


  constructor(
    private registroService: RegistroService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private dialogService: DialogService,
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
        this.estadosOrigen = res.estados_origen;
        this.estadosBeneficiario = res.estados_origen;
        this.estadosConstancia = res.estados_origen;
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
    let estadoIdSolicitante = this.form.get(`solicitante.estado_origen_id`)?.value;
    let municipioSolicitante = this.form.get(`solicitante.municipio_origen_id`);

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
    let estadoIdBeneficiario = this.form.get(`beneficiario.estado_id`)?.value;
    let municipioBeneficiario = this.form.get(`beneficiario.municipio_id`);

    if (!estadoIdBeneficiario) {
      municipioBeneficiario?.disable();
      municipioBeneficiario?.reset();
      return;
    }

    this.registroService.getMunicipios(estadoIdBeneficiario).subscribe(res => {
      this.municipiosBeneficiario = res;
      municipioBeneficiario!.enable();
      municipioBeneficiario!.reset();
    });
  }

  getMunicipiosConstancia() {
    let estadoIdConstancia = this.form.get(`documentacion.estado_id_constancia`)?.value;
    let municipioConstancia = this.form.get(`documentacion.municipio_id_constancia`);

    if (!estadoIdConstancia) {
      municipioConstancia?.disable();
      municipioConstancia?.reset();
      return;
    }

    this.registroService.getMunicipios(estadoIdConstancia).subscribe(res => {
      this.municipiosConstancia = res;
      municipioConstancia!.enable();
      municipioConstancia!.reset();
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

  pdfSubmit(event: any, curriculum: boolean) {
    const fileList: FileList = event.currentFiles;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const fileSizeInMB: number = file.size / (1024 * 1024);

      if (fileSizeInMB <= 1) {
        curriculum ? this.cv = file : this.constanciaFiscal = file;
      } else {

        event.target.value = null;
        this.cv = null;
      }
    } else {

      this.cv = null;
    }


  }

  imageSubmit(event: any, ine: boolean) {
    let files = event.target.files;
    let file = files[0];

    if (!file) return;

    if (file.size > 5000000) {
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
        if (ine) {
          this.selectedIneImage = reader.result;
        } else {
          this.selectedImage = reader.result;
        }
      };
      reader.onload = this.readerLoaded.bind(this);
      reader.readAsDataURL(file);
    }

    let archivoInput = event.target as HTMLInputElement;
    archivoInput.value = '';
  }


  readerLoadedProfile(readerEvt: any) {
    this.base64textStringProfile = readerEvt.target.result;
  }


  readerLoaded(readerEvt: any) {
    this.base64textString = readerEvt.target.result;
  }

  usarDomicilio() {
    if (this.form.controls.beneficiario.get('usarDomicilio')!.value) {
      const solicitanteControls = this.form.controls.solicitante.controls;
      const beneficiarioControls = this.form.controls.beneficiario.controls;
      this.municipiosBeneficiario = this.municipiosSolicitante;
      beneficiarioControls.calle.setValue(solicitanteControls.calle.value);
      beneficiarioControls.numero_ext.setValue(solicitanteControls.numero_ext.value);
      beneficiarioControls.numero_int.setValue(solicitanteControls.numero_int.value);
      beneficiarioControls.colonia.setValue(solicitanteControls.colonia.value);
      beneficiarioControls.codigo_postal.setValue(solicitanteControls.codigo_postal.value);
      beneficiarioControls.estado_id.setValue(solicitanteControls.estado_origen_id.value);
      beneficiarioControls.municipio_id.setValue(solicitanteControls.municipio_origen_id.value);
    } else {
      const beneficiarioControls = this.form.controls.beneficiario.controls;
      beneficiarioControls.calle.reset();
      beneficiarioControls.numero_ext.reset();
      beneficiarioControls.numero_int.reset();
      beneficiarioControls.colonia.reset();
      beneficiarioControls.codigo_postal.reset();
      beneficiarioControls.estado_id.reset();
      beneficiarioControls.municipio_id.reset();
    }
  }


  limpiarFormulario() {
    this.form.reset();
    this.form.get('documentacion.aviso')!.reset();
    this.image = '';
    this.imageProfile = '';
    this.imageURL = '';
    this.imageURLProfile = '';
    this.base64textString = '';
    this.base64textStringProfile = '';
  }


  verAviso() {

    const ruta = this.storage + 'aviso_de_privacidad.pdf';
    let url = this.domSanitizer.bypassSecurityTrustResourceUrl(ruta);
    this.dialogService.open(ModalVisualizarComponent,
      {
        header: 'Aviso de privacidad',
        width: '79vw',
        height: '90vh',
        contentStyle: {padding: 0},
        breakpoints: {
          '991px': '80vw',
          '640px': '90vw'
        },
        maximizable: true,
        data: url
      })
  }

  guardarRegistro(registro: any) {
    const formData = new FormData();
    Object.keys(registro).forEach(key => {
      formData.append(key, registro[key]);
    });
    if (this.cv) {
      formData.append('cv', this.cv);
    }
    if (this.constanciaFiscal) {
      formData.append('constanciaFiscal', this.constanciaFiscal);
    }
    this.registroService.crearRegistro(registro).subscribe({
      next: () => {
        const ine = registro.clave_ine;
        this.registroService.sendIne(formData, ine).subscribe({
          next: () => {
            window.location.reload();
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'El registro se ha creado con éxito.',
              life: 30000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error los archivos',
              detail: 'Hubo un problema al subir sus archivos.'
            });
          }
        });

      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al enviar',
          detail: 'Hubo un problema al registrarse.'
        });
      }

    })
    ;

  }


  onSubmit() {

    if (!this.base64textString && this.nuevoRegistro) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al enviar',
        detail: 'La fote de la INE es requerida.'
      });
      return;
    }
    if (!this.cv && this.nuevoRegistro) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El CV es requerido.'
      });
      return;
    }
    const vacantesValue = this.form.get('vacantes')?.value;
    const solicitanteValue = this.form.get('solicitante')?.value;
    const documentacionValue = this.form.get('documentacion')?.value;
    const beneficiarioValue = this.form.get('beneficiario')?.getRawValue();
    const mergedObject = {
      ...vacantesValue,
      ...solicitanteValue,
      ...documentacionValue,
      beneficiario: beneficiarioValue,
      foto_perfil: this.selectedImage,
      foto_credencial: this.selectedIneImage,
      update_foto_perfil: this.selectedImage,
      update_foto_credencial: this.selectedIneImage,

    };


    if (this.nuevoRegistro) {
      this.guardarRegistro(mergedObject);
    } else {
      // this.actualizarRegistro(registro);
    }
  }

  next() {
    let form: any;

    switch (this.active) {
      case 1:
        form = this.form['controls'].solicitante;
        break;
      case 2:
        form = this.form['controls'].beneficiario;
        break;
      case 3:
        form = this.form['controls'].documentacion;
        break;
      default:
        form = this.form['controls'].vacantes;
        break;
    }
    const formControls = form.controls as { [p: string]: AbstractControl<any, any> };

    if (form.invalid) {
      Object.keys(formControls).forEach(controlName => {
        formControls[controlName].markAsDirty();
      })

      return;
    }

    if (this.active < 3) {
      this.active += 1;
    }
  }

  back() {
    if (this.active > 0) {
      this.active -= 1;
    }
  }

}
