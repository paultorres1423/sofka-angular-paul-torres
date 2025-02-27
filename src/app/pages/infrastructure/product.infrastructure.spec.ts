import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ProductInfrastructure} from './product.infrastructure';
import {ProductDomain} from '../domain/product.domain';

describe('ProductInfrastructure', () => {
  let productInfrastructure: ProductInfrastructure;
  let httpTestingController: HttpTestingController;

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
    const mockResponse = {productDomain: [mockProductDomain]};

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
    const mockResponse = {message: 'Creado', data: mockProductDomain};

    productInfrastructure.create(mockProductDomain).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProductDomain);
    req.flush(mockResponse);
  });

  it('debe actualizar un producto', () => {
    const mockResponse = {message: 'Actualizado', data: mockProductDomain};

    productInfrastructure.update(mockProductDomain).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`/bp/products/${mockProductDomain.properties().id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProductDomain);
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
