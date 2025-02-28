import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductListComponent} from './product-list.component';
import {ProductApplication} from '../../application/product.application';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../../services/modal.service';
import {ProductDomain, ProductProperties} from '../../domain/product.domain';
import {of} from 'rxjs';

describe('ProductListComponent', () => {

  let productListComponent: ProductListComponent;
  let componentFixture: ComponentFixture<ProductListComponent>;
  let productApplicationSpyObj: jasmine.SpyObj<ProductApplication>;
  let routerSpyObj: jasmine.SpyObj<Router>;
  let modalServiceSpyObj: jasmine.SpyObj<ModalService>;

  const productProperties: ProductProperties = {
    id: '001',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'Logo 1',
    date_release: new Date(),
    date_revision: new Date()
  };
  const mockProductDomain = new ProductDomain(productProperties);

  const mockProducts = {data: [mockProductDomain.properties()]};

  beforeEach(async () => {
    productApplicationSpyObj = jasmine.createSpyObj('ProductApplication', ['list', 'delete']);
    routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    modalServiceSpyObj = jasmine.createSpyObj('ModalService', ['openModal']);
    productApplicationSpyObj.list.and.returnValue(of({data:[]}));
    routerSpyObj.navigate.and.returnValue(Promise.resolve(true));
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: ProductApplication, useValue: productApplicationSpyObj},
        {provide: Router, useValue: routerSpyObj},
        {provide: ModalService, useValue: modalServiceSpyObj},
        {
          provide: ActivatedRoute, useValue: {
            params: of({})
          }
        }
      ]
    }).compileComponents();
    componentFixture = TestBed.createComponent(ProductListComponent);
    productListComponent = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(productListComponent).toBeTruthy();
  });

  it('debe cargar la lista de productos al iniciar', () => {
    expect(productApplicationSpyObj.list).toHaveBeenCalled();
    expect(productListComponent.products).toEqual({data: []});
  });

  it('debe filtrar productos correctamente', () => {
    productListComponent.products = mockProducts; // Asegúrate de inicializar los productos
    productListComponent.searchTerm = 'Producto';
    productListComponent.filterProducts();
    expect(productListComponent.filteredProducts.data.length).toBe(1);
  });

  it('debe manejar la acción de editar', async () => {
    const event = {target: {value: 'edit'}} as any;
    await productListComponent.onActionChange(event, mockProductDomain.properties());
    expect(routerSpyObj.navigate).toHaveBeenCalledWith([
      '/product-form',
      {typeOfMaintenance: 'update', id: mockProductDomain.properties().id}
    ]);
  });

  it('debe manejar la acción de eliminar', async () => {
    const event = {target: {value: 'delete'}} as any;
    modalServiceSpyObj.openModal.and.returnValue(Promise.resolve(true));
    productApplicationSpyObj.delete.and.returnValue(of({message: 'Eliminado'}));
    await productListComponent.onActionChange(event, mockProductDomain.properties());
    expect(modalServiceSpyObj.openModal).toHaveBeenCalled();
    expect(productApplicationSpyObj.delete).toHaveBeenCalledWith(mockProductDomain.properties().id);
  });

});
