import {Inject, Injectable} from '@angular/core';
import {ProductInfrastructure} from '../infrastructure/product.infrastructure';
import {IProductRepository} from '../domain/iproduct.repository';
import {Observable} from 'rxjs';
import {ProductDomain, ProductProperties} from '../domain/product.domain';
import {AppException} from '../../exception/app.exception';

@Injectable()
export class ProductApplication {

  /**
   * Constructor de la clase ProductApplication
   * @param {IProductRepository} productRepository - Repositorio de productos inyectado
   */
  constructor(
    @Inject(ProductInfrastructure) private readonly productRepository: IProductRepository,
  ) {
  }

  /**
   * Lista todos los productos
   * @returns {Observable<{ data: [] }>} Un observable que emite una lista de datos.
   */
  list(): Observable<{ data: [] }> {
    return this.productRepository.list();
  }

  /**
   * Valida si un ID de producto existe
   * @param {string} id - ID del producto a validar
   * @returns {Observable<boolean>} Observable con el resultado de la validacion
   */
  validateId(id: string): Observable<boolean> {
    return this.productRepository.validateId(id);
  }

  /**
   * Crea un nuevo producto
   * @param {ProductProperties} productProperties - Propiedades del producto a crear
   * @returns {Observable<{ message: string, data: ProductDomain }>} Observable con el mensaje y los datos del producto creado
   * @throws {AppException} Si el ID del producto ya existe
   */
  create(productProperties: ProductProperties): Observable<{ message: string, data: ProductDomain }> {
    this.validateId(productProperties.id).subscribe((response: boolean) => {
      if (response) {
        new AppException('El ID ya existe');
      }
    });
    const productDomain = new ProductDomain(productProperties);
    return this.productRepository.create(productDomain);
  }

  /**
   * Actualiza un producto existente
   * @param {ProductProperties} productProperties - Propiedades del producto a actualizar
   * @returns {Observable<{ message: string, data: ProductDomain }>} Observable con el mensaje y los datos del producto actualizado
   */
  update(productProperties: ProductProperties): Observable<{ message: string, data: ProductDomain }> {
    const productDomain = new ProductDomain(productProperties);
    return this.productRepository.update(productDomain);
  }

  /**
   * Elimina un producto por su ID
   * @param {string} id - ID del producto a eliminar
   * @returns {Observable<{ message: string }>} Observable con el mensaje de eliminacion
   */
  delete(id: string): Observable<{ message: string }> {
    return this.productRepository.delete(id);
  }

}
