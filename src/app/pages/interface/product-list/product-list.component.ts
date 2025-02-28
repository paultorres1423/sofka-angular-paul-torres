import {Component} from '@angular/core';
import {ProductApplication} from "../../application/product.application";
import {ResponseProductListDto} from '../dto/response-product-list.dto';
import {Router, RouterLink} from '@angular/router';
import {ModalService} from '../../../services/modal.service';

/**
 * Componente para mostrar la lista de productos.
 */
@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink
  ],
  templateUrl: './product-list.component.html',
  styles: ``
})
export class ProductListComponent {

  products: ResponseProductListDto = new ResponseProductListDto();
  filteredProducts: ResponseProductListDto = new ResponseProductListDto();
  numberRecords: number = 5;
  searchTerm: string = '';

  /**
   * Constructor del componente.
   * @param productApplication Servicio de aplicacion de productos.
   * @param router Servicio de enrutamiento.
   * @param modalService Servicio de modal.
   */
  constructor(
    private readonly productApplication: ProductApplication,
    private readonly router: Router,
    private readonly modalService: ModalService,
  ) {
    this.list().then();
  }

  /**
   * Obtiene la lista de productos.
   */
  async list() {
    this.productApplication.list().subscribe((response: any) => {
      this.products = response;
      this.filterProducts();
    });
  }

  /**
   * Filtra los productos segun el termino de busqueda.
   */
  filterProducts() {
    if (this.searchTerm) {
      this.filteredProducts.data = this.products.data.filter(product =>
        Object.values(product).some(value =>
          value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredProducts.data = [...this.products.data];
    }
  }

  /**
   * Obtiene el numero de registros filtrados.
   * @returns Numero de registros filtrados.
   */
  getNumberRecords(): number {
    return this.filteredProducts.data.length;
  }

  /**
   * Maneja el cambio de accion en el select de acciones.
   * @param event Evento del cambio.
   * @param product Producto seleccionado.
   */
  async onActionChange(event: Event, product: any) {
    const selectElement = event.target as HTMLSelectElement;
    const action = selectElement.value;
    selectElement.value = ''; // Restablecer el valor del select
    if (action === 'edit') {
      this.router.navigate(['/product-form', {typeOfMaintenance: 'update', id: product.id}]).then();
    } else if (action === 'delete') {
      await this.deleteRecord(product);
    }
  }

  /**
   * Elimina un producto.
   * @param product Producto a eliminar.
   */
  private async deleteRecord(product: any) {
    const confirmed = await this.modalService.openModal(`¿Estás seguro de eliminar este producto ${product.name}?`);
    if (confirmed) {
      this.productApplication.delete(product.id).subscribe(() => {
        this.list().then();
      });
    }
  }

  /**
   * Maneja el cambio de numero de registros a mostrar.
   * @param event Evento del cambio.
   */
  onFilterNumberPage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.numberRecords = Number(selectElement.value);
  }

  /**
   * Maneja el cambio en el termino de busqueda.
   * @param event Evento del cambio.
   */
  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.filterProducts();
  }

}
