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
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../environments/environment.development";
import {ModalVisualizarComponent} from "../../share/components/modals/modal-visualizar/modal-visualizar.component";
import {DialogService} from "primeng/dynamicdialog";
import {DomSanitizer} from "@angular/platform-browser";
import {TabViewModule} from "primeng/tabview";
import * as CryptoJS from 'crypto-js';
import {InputMaskModule} from "primeng/inputmask";
import {ModalAlertComponent} from "../../share/components/modals/modal-alert/modal-alert.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [StepsModule, ToastModule, Button, MatStepper, MatStep, ReactiveFormsModule, NgIf, DropdownModule, NgTemplateOutlet, FormsModule, FloatLabelModule, ChipsModule, CalendarModule, FileUploadModule, CheckboxModule, NgClass, TabViewModule, InputMaskModule, ModalAlertComponent],
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
  municipiosBeneficiario: any[] = [];
  municipiosConstancia: any[] = [];
  estadosOrigen = [];
  estadosBeneficiario = [];
  estadosConstancia = [];
  query: any;
  id: any;
  maxDate: any;
  sexo = []
  estadoCivil = []
  parentescos = []
  image: any;
  imageURL: any;
  code = '';
  cv: File | null = null;
  constanciaFiscal: File | null = null;
  imageProfile: any;
  imageURLProfile: any;
  selectedImage: string | ArrayBuffer | null = null;
  nuevoRegistro = true;
  storage = environment.api.storageUrl
  selectedIneImage: string | ArrayBuffer | null = null;
  update_foto_perfil = false;
  update_foto_credencial = false;
  loading: boolean = false;
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
      fecha_nacimiento: ['', [Validators.required, this.min18YearsValidator]],
      calle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ]],
      numero_int: ['', [Validators.minLength(1), Validators.maxLength(5), Validators.pattern(/^([0-9])*$/)]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      codigo_postal: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^([0-9])*$/)]],
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
      rfc: ['', [Validators.required, Validators.minLength(13), Validators.pattern(/^([A-ZÑ&]{3,4}) ?(\d{2})(\d{2})(\d{2}) ?([A-Z\d]{3})?$/i)]],
      calle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      numero_ext: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ]],
      numero_int: ['', [Validators.minLength(1), Validators.maxLength(5), Validators.pattern(/^([0-9])*$/)]],
      colonia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      codigo_postal: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      estado_id: ['', Validators.required],
      municipio_id: [{value: '', disabled: true}, Validators.required],
      usarDomicilio: [false],

    }),
    documentacion: this._formBuilder.group({
      clave_ine: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      curp: ['', [Validators.required, Validators.minLength(18), Validators.minLength(18), Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.pattern(/^([A-ZÑ&]{3,4}) ?(\d{2})(\d{2})(\d{2}) ?([A-Z\d]{3})?$/i)]],
      nss: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      codigo_postal_constancia: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
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
    private activeRoute: ActivatedRoute,
    private dialogService: DialogService,
  ) {
    this.activeRoute.queryParams.subscribe(res => {
      this.query = res['id'];
    })
    this.getDateTime();
    this.getEstados();
    this.getSexo();
    this.getEstadoCivil();
    this.getParentesco();
  }

  ngOnInit() {

    if (this.query) {
      this.nuevoRegistro = false;
      let decrypted = CryptoJS.AES.decrypt(this.query.toString(), environment.api.PW);
      let result = this.fromhex(decrypted.toString());
      let uint8Array = new Uint8Array(result);
      let utf8Decoder = new TextDecoder()
      this.id = utf8Decoder.decode(uint8Array)

      this.registroService.show(this.id).subscribe(res => {
        this.form.reset(res)




        if (res.documentacion && res.documentacion.aviso) {
          this.form.get('documentacion.aviso')?.setValue(true);
        } else {
          this.form.get('documentacion.aviso')?.setValue(false);
        }


        this.getMunicipiosBeneficiario();
        this.getMunicipiosSolicitante();
        this.getMunicipios();
        this.getMunicipiosConstancia();
        this.selectedImage = environment.api.storageUrl + res.foto_perfil
        this.selectedIneImage = environment.api.storageUrl + res.foto_credencial

        setTimeout(() => {
          this.nuevoRegistro = false;
        }, 5000);
      })
    }
    this.items = [
      {label: 'Vacantes'},
      {label: 'Solicitante'},
      {label: 'Beneficiario'},
      {label: 'Documentación'}
    ];
  }

  fromhex(hex: string): number[] {
    if (hex.length % 2 !== 0) {
      throw new Error("Hex string should contain an even number of hex digits, one per byte");
    }
    const unsignedByteArray: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      const h = hex.substring(i, i + 2);
      if (!/^[0-9a-f]{2}$/i.test(h)) {
        throw new Error(`Invalid hexdigit at offset ${i}`);
      }
      unsignedByteArray.push(parseInt(h, 16));
    }
    return unsignedByteArray;
  }

  getEstados() {
    this.registroService.getEstados().subscribe({
      next: (res) => {
        this.estados = res.estados;
        this.vacantes = res.vacantes;
        this.estadosOrigen = res.estados_origen;
        this.estadosBeneficiario = res.estados_origen;
        this.estadosConstancia = res.estados_origen;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getMunicipios() {
    let estadoId = this.form.get(`vacantes.estado_id`)?.value;
    let municipio = this.form.get(`vacantes.municipio_id`);

    if (!estadoId) {
      municipio?.disable();
      municipio?.reset();
      return;
    }
    this.registroService.getMunicipios(estadoId).subscribe(res => {
      this.municipios = res;
      if (this.nuevoRegistro) {
        municipio!.enable();
        municipio!.reset();
      }
    });

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
      if (this.nuevoRegistro) {
        municipioSolicitante!.enable();
        municipioSolicitante!.reset();
      }

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
      if (this.nuevoRegistro) {
        municipioBeneficiario!.enable();
        municipioBeneficiario!.reset();
      }
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
      if (this.nuevoRegistro) {
        municipioConstancia!.enable();
        municipioConstancia!.reset();
      }

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
          this.update_foto_credencial = true;
        } else {
          this.selectedImage = reader.result;
          this.update_foto_perfil = true;
        }
      };
      reader.readAsDataURL(file);
    }

    let archivoInput = event.target as HTMLInputElement;
    archivoInput.value = '';
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
            this.loading = false;
            window.location.reload();
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'El registro se ha creado con éxito.',
              life: 30000
            });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error los archivos',
              detail: 'Hubo un problema al subir sus archivos.'
            });
          }
        });

      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al enviar',
          detail: 'Hubo un problema al registrarse.'
        });
      }

    });

  }


  actualizarRegistro(registro: any) {
    this.loading = true;
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

    const ine = registro.clave_ine;

    this.registroService.actualizarRegistro(this.id, registro).subscribe({
      next: () => {

        this.registroService.sendIne(formData, ine).subscribe({
          next: () => {
            this.loading = false;
            window.location.reload();
            this.messageService.add({
              severity: 'success',
              summary: 'Actualización exitosa',
              detail: 'El registro se ha actualizado con éxito.',
              life: 30000
            });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error con los archivos',
              detail: 'Hubo un problema al actualizar sus archivos.'
            });
          }
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: 'Hubo un problema al actualizar el registro.'
        });
      }
    });
  }


  onSubmit() {

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(innerKey => {
          control.get(innerKey)?.markAsDirty();
          control.get(innerKey)?.markAsTouched();
        });
      } else {
        control?.markAsDirty();
        control?.markAsTouched();
      }
    });


    if (!this.selectedIneImage && this.nuevoRegistro) {
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

    if (!this.constanciaFiscal && this.nuevoRegistro) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La constancia fiscal es requerida.'
      });
      return;
    }

    if (!this.form.get('documentacion.aviso')!.value && this.nuevoRegistro) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes aceptar el aviso de privacidad.'
      });
      return;
    }


    const vacantesValue = this.form.get('vacantes')?.getRawValue();
    const solicitanteValue = this.form.get('solicitante')?.getRawValue();
    const documentacionValue = this.form.get('documentacion')?.getRawValue();
    const beneficiarioValue = this.form.get('beneficiario')?.getRawValue();
    const mergedObject = {
      ...vacantesValue,
      ...solicitanteValue,
      ...documentacionValue,
      beneficiario: beneficiarioValue,
      foto_perfil: this.selectedImage,
      foto_credencial: this.selectedIneImage,
      update_foto_perfil: this.update_foto_perfil,
      update_foto_credencial: this.update_foto_credencial,

    };

    this.loading = true;

    if (this.nuevoRegistro) {
      this.guardarRegistro(mergedObject);
    } else {

      this.actualizarRegistro(mergedObject);
    }

  }

  isControlHasError(controlGroup: string, controlName: string, validationType: string): boolean {
    const controlG = this.form.get(controlGroup);
    const control = controlG?.get(controlName);

    if (!control || !control.dirty) {
      return false;
    }

    return control.hasError(validationType);
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

  goToURl(url: string) {
    open(url)
  }

  min18YearsValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date();
    const birthDate = new Date(control.value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const isAdult = age > 18 || (age === 18 && monthDifference >= 0);
    return isAdult ? null : { 'underage': true };
  }

}
