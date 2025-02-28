import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ProductApplication} from '../../application/product.application';
import {ProductProperties} from '../../domain/product.domain';
import {ActivatedRoute} from '@angular/router';
import {TypeOfMaintenance} from '../../../common/data-types';

/**
 * Componente de formulario de producto
 */

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styles: ``
})
export class ProductFormComponent implements OnInit {

  typeOfMaintenance!: TypeOfMaintenance;
  id!: string;
  formGroup!: FormGroup;
  minlengthId = 3;
  maxlengthId = 10;
  minlengthName = 5;
  maxlengthName = 100;
  minlengthDescription = 10;
  maxlengthDescription = 200;

  /**
   * @param productApplication Servicio de aplicacion de producto
   * @param activatedRoute Ruta activada para obtener parametros
   */
  constructor(
    private readonly productApplication: ProductApplication,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.loadForm();
  }

  /**
   * Formulario reactivo para el producto
   */
  loadForm() {
    this.formGroup = new FormGroup({
      id: new FormControl('', [
        Validators.required,
        Validators.minLength(this.minlengthId),
        Validators.maxLength(this.maxlengthId)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(this.minlengthName),
        Validators.maxLength(this.maxlengthName)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(this.minlengthDescription),
        Validators.maxLength(this.maxlengthDescription)
      ]),
      logo: new FormControl('', [
        Validators.required,
      ]),
      date_release: new FormControl('', [
        Validators.required,
        this.validateDateRelease()
      ]),
      date_revision: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  /**
   * Inicializa el componente
   */
  ngOnInit(): void {
    this.formGroup.get('date_revision')?.disable();
    this.typeOfMaintenance = this.activatedRoute.snapshot.params['typeOfMaintenance'];
    if (this.typeOfMaintenance === 'update') {
      this.id = this.activatedRoute.snapshot.params['id'];
      this.formGroup.get('id')?.setValue(this.id);
      this.formGroup.get('id')?.disable();
    }
  }

  /**
   * Valida la fecha de lanzamiento
   * @returns Funcion de validacion
   */
  private validateDateRelease() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const inputDate = new Date(control.value);
      const currentDate = new Date();
      const inputDateString = inputDate.toISOString().split('T')[0];
      const currentDateString = currentDate.toISOString().split('T')[0];
      return inputDateString >= currentDateString ? null : {'dateRelease': true};
    };
  }

  /**
   * Maneja el cambio de la fecha de lanzamiento
   * @param event Evento de cambio
   */
  onDateReleaseChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value) {
      const dateRelease = new Date(value);
      const dateRevision = new Date(dateRelease);
      dateRevision.setFullYear(dateRelease.getFullYear() + 1);
      this.formGroup.get('date_revision')?.setValue(dateRevision.toISOString().split('T')[0]);
    }
  }

  /**
   * Realiza el mantenimiento del producto
   */
  maintenance() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const productProperties: ProductProperties = this.createProductProperties();
    switch (this.typeOfMaintenance) {
      case 'create':
        this.create(productProperties);
        break;
      case 'update':
        this.update(productProperties);
        break;
    }
  }

  /**
   * Crea un nuevo producto
   * @param productProperties Propiedades del producto
   */
  private create(productProperties: ProductProperties) {
    this.productApplication.create(productProperties).subscribe((response: any) => {
        console.log(response);
      }
    )
  }

  /**
   * Crea un nuevo producto
   * @param productProperties Propiedades del producto
   */
  update(productProperties: ProductProperties) {
    this.productApplication.update(productProperties).subscribe((response: any) => {
        console.log(response);
      }
    )
  }

  /**
   * Crea las propiedades del producto a partir del formulario
   * @returns Propiedades del producto
   */
  private createProductProperties(): ProductProperties {
    return {
      id: this.formGroup.get('id')?.value,
      name: this.formGroup.get('name')?.value,
      description: this.formGroup.get('description')?.value,
      logo: this.formGroup.get('logo')?.value,
      date_release: this.formGroup.get('date_release')?.value,
      date_revision: this.formGroup.get('date_revision')?.value
    };
  }

}
