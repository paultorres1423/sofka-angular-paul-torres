import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductFormComponent} from './product-form.component';
import {ProductApplication} from '../../application/product.application';
import {ActivatedRoute} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {ProductDomain, ProductProperties} from '../../domain/product.domain';

describe('ProductFormComponent', () => {
    let component: ProductFormComponent;
    let fixture: ComponentFixture<ProductFormComponent>;
    let productApplicationSpy: jasmine.SpyObj<ProductApplication>;

    const mockProductProperties: ProductProperties = {
        id: '1',
        name: 'Producto Test',
        description: 'Descripción Test',
        logo: 'logo.png',
        date_release: new Date(),
        date_revision: new Date()
    };

    const mockProductDomain = new ProductDomain(mockProductProperties);

    beforeEach(async () => {
        productApplicationSpy = jasmine.createSpyObj('ProductApplication', ['create', 'update']);
        productApplicationSpy.create.and.returnValue(of({
            message: 'Creado',
            data: mockProductDomain
        }));
        productApplicationSpy.update.and.returnValue(of({
            message: 'Actualizado',
            data: mockProductDomain
        }));

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                {provide: ProductApplication, useValue: productApplicationSpy},
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

        fixture = TestBed.createComponent(ProductFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe validar el formulario correctamente', () => {
        expect(component.formGroup.valid).toBeFalsy();

        component.formGroup.patchValue({
            id: '123',
            name: 'Producto Test',
            description: 'Descripción de prueba detallada',
            logo: 'logo.png',
            date_release: new Date().toISOString().split('T')[0],
            date_revision: new Date().toISOString().split('T')[0]
        });

        expect(component.formGroup.valid).toBeTruthy();
    });

    it('debe actualizar date_revision al cambiar date_release', () => {
        const dateRelease = new Date();
        const event = {
            target: {value: dateRelease.toISOString().split('T')[0]}
        } as any;

        component.onDateReleaseChange(event);

        const dateRevision = component.formGroup.get('date_revision')?.value;
        expect(dateRevision).toBeTruthy();
    });

    it('debe crear un nuevo producto', async () => {
        component.typeOfMaintenance = 'create';
        component.formGroup.setValue({
            id: 'test-id',
            name: 'Test Product',
            description: 'Test Description',
            logo: 'test-logo',
            date_release: new Date(),
            date_revision: new Date()
        });
        await component.maintenance();
        expect(productApplicationSpy.create).toHaveBeenCalled();
    });

    it('debe mostrar errores cuando el formulario es inválido', () => {
        component.maintenance();
        expect(component.formGroup.touched).toBeTrue();
        expect(productApplicationSpy.create).not.toHaveBeenCalled();
    });
});
