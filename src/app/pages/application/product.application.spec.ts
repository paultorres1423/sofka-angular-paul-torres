import {TestBed} from '@angular/core/testing';
import {ProductApplication} from './product.application';
import {ProductInfrastructure} from '../infrastructure/product.infrastructure';
import {ProductDomain} from '../domain/product.domain';
import {of} from 'rxjs';

describe('ProductApplication', () => {
    let productApplication: ProductApplication;
    let productInfrastructureSpy: jasmine.SpyObj<ProductInfrastructure>;

    const mockDate = new Date();
    const mockProduct = {
        id: '1',
        name: 'Producto Test',
        description: 'Descripción Test',
        logo: 'Logo Test',
        date_release: mockDate,
        date_revision: mockDate
    };

    const mockProductDomain = new ProductDomain(mockProduct);

    beforeEach(() => {
        productInfrastructureSpy = jasmine.createSpyObj('ProductInfrastructure', [
            'list',
            'validateId',
            'create',
            'update',
            'delete'
        ]);

        TestBed.configureTestingModule({
            providers: [
                ProductApplication,
                {provide: ProductInfrastructure, useValue: productInfrastructureSpy}
            ]
        });

        productApplication = TestBed.inject(ProductApplication);
    });

    it('debe crear la aplicación', () => {
        expect(productApplication).toBeTruthy();
    });

    it('debe listar productos', (done) => {
        const mockResponse = {productDomain: [mockProductDomain]};
        productInfrastructureSpy.list.and.returnValue(of(mockResponse));

        productApplication.list().subscribe(response => {
            console.log('Lista de productos:', response.productDomain);
            expect(response).toEqual(mockResponse);
            expect(productInfrastructureSpy.list).toHaveBeenCalled();
            done();
        });
    });

    it('debe validar ID', (done) => {
        productInfrastructureSpy.validateId.and.returnValue(of(false));

        productApplication.validateId('1').subscribe(response => {
            expect(response).toBeFalse();
            expect(productInfrastructureSpy.validateId).toHaveBeenCalledWith('1');
            done();
        });
    });

    it('debe crear un producto', (done) => {
        productInfrastructureSpy.validateId.and.returnValue(of(false));
        productInfrastructureSpy.create.and.returnValue(of({
            message: 'Creado',
            data: mockProductDomain
        }));

        productApplication.create(mockProduct).subscribe(response => {
            expect(response.message).toBe('Creado');
            expect(response.data).toEqual(mockProductDomain);
            expect(productInfrastructureSpy.create).toHaveBeenCalled();
            done();
        });
    });

    it('debe actualizar un producto', (done) => {
        productInfrastructureSpy.update.and.returnValue(of({
            message: 'Actualizado',
            data: mockProductDomain
        }));

        productApplication.update(mockProduct).subscribe(response => {
            expect(response.message).toBe('Actualizado');
            expect(response.data).toEqual(mockProductDomain);
            expect(productInfrastructureSpy.update).toHaveBeenCalled();
            done();
        });
    });

    it('debe eliminar un producto', (done) => {
        productInfrastructureSpy.delete.and.returnValue(of({message: 'Eliminado'}));

        productApplication.delete('1').subscribe(response => {
            expect(response.message).toBe('Eliminado');
            expect(productInfrastructureSpy.delete).toHaveBeenCalledWith('1');
            done();
        });
    });
});
