import {TestBed} from '@angular/core/testing';
import {ProductApplication} from './product.application';
import {ProductInfrastructure} from '../infrastructure/product.infrastructure';
import {ProductDomain, ProductProperties} from '../domain/product.domain';
import {of} from 'rxjs';

describe('ProductApplication', () => {
  let productApplication: ProductApplication;
  let productInfrastructureSpy: jasmine.SpyObj<ProductInfrastructure>;

  const productProperties: ProductProperties = {
    id: '001',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'Logo 1',
    date_release: new Date(),
    date_revision: new Date()
  };
  const productDomain = new ProductDomain(productProperties);

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
    productInfrastructureSpy.list.and.returnValue(of({data:[]}));
    productApplication.list().subscribe(response => {
      console.log('Lista de productos:', response);
      expect(response).toEqual({data:[]});
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
      data: productDomain
    }));
    productApplication.create(productProperties).subscribe(response => {
      expect(response.message).toBe('Creado');
      expect(response.data).toEqual(productDomain);
      expect(productInfrastructureSpy.create).toHaveBeenCalled();
      done();
    });
  });

  it('debe actualizar un producto', (done) => {
    productInfrastructureSpy.update.and.returnValue(of({
      message: 'Actualizado',
      data: productDomain
    }));
    productApplication.update(productProperties).subscribe(response => {
      expect(response.message).toBe('Actualizado');
      expect(response.data).toEqual(productDomain);
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
