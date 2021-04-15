import { Ciudad } from './models/ciudad.models';
import { Departamento } from './models/departamento.models';
import { Modelo } from './models/modelo.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CotizarService } from './services/cotizar.service';
import { Cotizar } from './models/cotizar.models';
import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class AppComponent {
  title = 'landing';
  form: FormGroup;
  submitted: boolean;
  cotizar: Cotizar;
  modelos: Modelo[];
  departamentos: Departamento[];
  ciudades: Ciudad[];
  modalError: boolean = false;

  constructor(
    public cotizarService: CotizarService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.initForm();
    this.getModelos();
    this.getDepartamentos();
  }

  getModelos() {
    this.cotizarService.getModelos().then((data) => {
      let array = [];
      data[1].subitems.forEach((element) => {
        array.push(element.subtitle);
      });
      this.modelos = array;
    });
  }

  getDepartamentos() {
    this.cotizarService.getDepartamentos().then((data) => {
      this.departamentos = data;
    });
  }

  getCiudad(departamento: number) {
    this.cotizarService.getCiudad(departamento).then((data) => {
      this.ciudades = data;
    });
  }

  save() {
    this.submitted = true;

    if (this.form.valid) {
      this.cotizar = {};
      this.cotizar.modelo = this.form.value.modelo;
      this.cotizar.nombre = this.form.value.nombre;
      this.cotizar.email = this.form.value.email;
      this.cotizar.telefono = this.form.value.telefono;
      this.cotizar.departamento = this.form.value.departamento;
      this.cotizar.ciudad = this.form.value.ciudad;
      this.cotizar.tratamiento = this.form.value.tratamiento;
      this.cotizarService.save(this.cotizar).subscribe((data) => {
        if (data['error'] == 0) {
          this.openSuccess();
          this.form.reset();
          this.form.value.departamento = "";
          this.form.value.ciudad = "";
        } else if (data['error'] == 1) {
          this.openError();
        } else if (data['error'] == 2) {
          this.openDuplicado();
        }
      });
    } else {
      this.openError();
    }
  }

  initForm(): void {
    this.form = new FormGroup({
      modelo: new FormControl('', Validators.required),
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/),
      ]),
      departamento: new FormControl('', Validators.required),
      ciudad: new FormControl('', Validators.required),
      tratamiento: new FormControl('', Validators.requiredTrue),
    });
  }

  get modelo() {
    return this.form.controls['modelo'];
  }
  get nombre() {
    return this.form.controls['nombre'];
  }
  get email() {
    return this.form.controls['email'];
  }
  get telefono() {
    return this.form.controls['telefono'];
  }
  get departamento() {
    return this.form.controls['departamento'];
  }
  get ciudad() {
    return this.form.controls['ciudad'];
  }
  get tratamiento() {
    return this.form.controls['tratamiento'];
  }

  getErrorMessage(input): string {
    if (input.hasError('required')) return 'El campo es requerido';
    if (input.hasError('minlength')) return 'Aún te falta escribir más...';
    if (input.hasError('maxlength')) return 'Tamaño maximo superado';
    if (input.hasError('Mask error')) return 'Formato Invalido';
    if (input.hasError('email')) return 'Formato Email Invalido';
    if (input.hasError('pattern')) return 'Formato Invalido';
    return '';
  }

  cargarCiudad(event) {
    if (event != 0) {
      this.getCiudad(event);
    } else {
      this.ciudades = [];
    }
  }
  @ViewChild('content', { static: false }) content: ElementRef;
  openError() {
    this.modalService.open(this.content);
  }

  @ViewChild('success', { static: false }) success: ElementRef;
  openSuccess() {
    this.modalService.open(this.success, { size: 'lg' });
  }
  @ViewChild('error', { static: false }) error: ElementRef;
  openDuplicado() {
    this.modalService.open(this.error);
  }
}
