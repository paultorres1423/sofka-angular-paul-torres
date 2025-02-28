import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductFormComponent} from './product-form.component';
import {ProductApplication} from '../../application/product.application';
import {ActivatedRoute} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {ProductDomain, ProductProperties} from '../../domain/product.domain';

describe('ProductFormComponent', () => {

  let productFormComponent: ProductFormComponent;
  let componentFixture: ComponentFixture<ProductFormComponent>;
  let productApplicationSpyObj: jasmine.SpyObj<ProductApplication>;

  const productProperties: ProductProperties = {
    id: '001',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'Logo 1',
    date_release: new Date(),
    date_revision: new Date()
  };
  const productDomain = new ProductDomain(productProperties);

  beforeEach(async () => {
    productApplicationSpyObj = jasmine.createSpyObj('ProductApplication', ['create', 'update']);
    productApplicationSpyObj.create.and.returnValue(of({
      message: 'Creado',
      data: productDomain
    }));
    productApplicationSpyObj.update.and.returnValue(of({
      message: 'Actualizado',
      data: productDomain
    }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        {provide: ProductApplication, useValue: productApplicationSpyObj},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {typeOfMaintenance: 'create'}
            }
          }
        }
      ]
    }).compileComponents();

    componentFixture = TestBed.createComponent(ProductFormComponent);
    productFormComponent = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(productFormComponent).toBeTruthy();
  });

  it('debe validar el formulario correctamente', () => {
    expect(productFormComponent.formGroup.valid).toBeFalsy();
    productFormComponent.formGroup.patchValue({
      id: '123',
      name: 'Producto Test',
      description: 'Descripción de prueba detallada',
      logo: 'logo.png',
      date_release: new Date().toISOString().split('T')[0],
      date_revision: new Date().toISOString().split('T')[0]
    });
    expect(productFormComponent.formGroup.valid).toBeTruthy();
  });

  it('debe actualizar un producto existente', async () => {
    productFormComponent.typeOfMaintenance = 'update';
    productFormComponent.id = 'test-id';
    productFormComponent.formGroup.patchValue({
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo',
      date_release: new Date(),
      date_revision: new Date()
    });
    await productFormComponent.maintenance();
    expect(productApplicationSpyObj.update).toHaveBeenCalled();
  });

  it('debe crear un nuevo producto', async () => {
    productFormComponent.typeOfMaintenance = 'create';
    productFormComponent.formGroup.setValue({
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo',
      date_release: new Date(),
      date_revision: new Date()
    });
    await productFormComponent.maintenance();
    expect(productApplicationSpyObj.create).toHaveBeenCalled();
  });

  it('debe mostrar errores cuando el formulario es inválido', () => {
    productFormComponent.maintenance();
    expect(productFormComponent.formGroup.touched).toBeTrue();
    expect(productApplicationSpyObj.create).not.toHaveBeenCalled();
  });

  it('debe validar fecha de lanzamiento correctamente', () => {
    const dateRelease = productFormComponent.formGroup.get('date_release');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    dateRelease?.setValue(futureDate);
    expect(dateRelease?.errors).toBeNull();

    // Prueba fecha pasada
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    dateRelease?.setValue(pastDate);
    expect(dateRelease?.errors?.['dateRelease']).toBeTruthy();

    // Prueba sin valor
    dateRelease?.setValue(null);
    expect(dateRelease?.errors?.['dateRelease']).toBeFalsy();
  });

  it('debe calcular fecha de revisión al cambiar fecha de lanzamiento', () => {
    const dateRelease = new Date();
    const event = {
      target: {
        value: dateRelease.toISOString().split('T')[0]
      }
    } as any;
    productFormComponent.onDateReleaseChange(event);
    const expectedRevisionDate = new Date(dateRelease);
    expectedRevisionDate.setFullYear(dateRelease.getFullYear() + 1);
    const actualRevisionDate = productFormComponent.formGroup.get('date_revision')?.value;
    expect(actualRevisionDate).toBe(expectedRevisionDate.toISOString().split('T')[0]);
  });

});
