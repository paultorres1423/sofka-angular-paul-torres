import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ProductInfrastructure} from './product.infrastructure';
import {ProductDomain, ProductProperties} from '../domain/product.domain';

describe('ProductInfrastructure', () => {

  let productInfrastructure: ProductInfrastructure;
  let httpTestingController: HttpTestingController;

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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductInfrastructure]
    });
    productInfrastructure = TestBed.inject(ProductInfrastructure);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('debe listar productos', () => {
    const mockResponse: { data: [] } = {data: []};
    productInfrastructure.list().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe validar ID', () => {
    const mockResponse = true;
    productInfrastructure.validateId('1').subscribe(response => {
      expect(response).toBeTrue();
    });
    const req = httpTestingController.expectOne('/bp/products/verification/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe crear un producto', () => {
    const mockResponse = {message: 'Creado', data: productDomain};
    productInfrastructure.create(productDomain).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(productDomain);
    req.flush(mockResponse);
  });

  it('debe actualizar un producto', () => {
    const mockResponse = {message: 'Actualizado', data: productDomain};
    productInfrastructure.update(productDomain).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`/bp/products/${productDomain.properties().id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(productDomain);
    req.flush(mockResponse);
  });

  it('debe eliminar un producto', () => {
    const mockResponse = {message: 'Eliminado'};
    productInfrastructure.delete('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne('/bp/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
