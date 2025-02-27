import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductListComponent} from './product-list.component';
import {ProductApplication} from '../../application/product.application';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalService} from '../../../services/modal.service';
import {of} from 'rxjs';
import {ProductDomain} from '../../domain/product.domain';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productApplicationSpy: jasmine.SpyObj<ProductApplication>;
    let routerSpy: jasmine.SpyObj<Router>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;

    const mockDate = new Date();
    const mockProductDomain = new ProductDomain({
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'Logo 1',
        date_release: mockDate,
        date_revision: mockDate
    });

    const mockProducts = {
        data: [mockProductDomain.properties()]
    };

    beforeEach(async () => {
        productApplicationSpy = jasmine.createSpyObj('ProductApplication', ['list', 'delete']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        modalServiceSpy = jasmine.createSpyObj('ModalService', ['openModal']);

        productApplicationSpy.list.and.returnValue(of({productDomain: [mockProductDomain]}));

        await TestBed.configureTestingModule({
            imports: [],
            providers: [
                {provide: ProductApplication, useValue: productApplicationSpy},
                {provide: Router, useValue: routerSpy},
                {provide: ModalService, useValue: modalServiceSpy},
                {
                    provide: ActivatedRoute, useValue: {
                        params: of({}) // Mock the params observable
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe cargar la lista de productos al iniciar', () => {
        expect(productApplicationSpy.list).toHaveBeenCalled();
        expect(component.products).toEqual(mockProducts);
    });

    it('debe filtrar productos correctamente', () => {
        component.searchTerm = 'Producto';
        component.filterProducts();
        expect(component.filteredProducts.data.length).toBe(1);
    });

    it('debe manejar la acción de editar', async () => {
        const event = {target: {value: 'edit'}} as any;

        await component.onActionChange(event, mockProductDomain.properties());

        expect(routerSpy.navigate).toHaveBeenCalledWith([
            '/product-form',
            {typeOfMaintenance: 'update', id: mockProductDomain.properties().id}
        ]);
    });

    it('debe manejar la acción de eliminar', async () => {
        const event = {target: {value: 'delete'}} as any;

        modalServiceSpy.openModal.and.returnValue(Promise.resolve(true));
        productApplicationSpy.delete.and.returnValue(of({message: 'Eliminado'}));

        await component.onActionChange(event, mockProductDomain.properties());

        expect(modalServiceSpy.openModal).toHaveBeenCalled();
        expect(productApplicationSpy.delete).toHaveBeenCalledWith(mockProductDomain.properties().id);
    });
});
