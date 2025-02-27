import {HttpClient} from '@angular/common/http';
import {IProductRepository} from '../domain/iproduct.repository';
import {ProductDomain} from '../domain/product.domain';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

/**
 * Servicio de infraestructura para manejar productos.
 * Implementa la interfaz IProductRepository.
 */
@Injectable()
export class ProductInfrastructure implements IProductRepository {

  /**
   * Constructor de la clase ProductInfrastructure.
   * @param httpClient - Cliente HTTP para realizar solicitudes.
   */
  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  /**
   * Obtiene una lista de productos.
   * @returns Observable con un objeto que contiene un array de ProductDomain.
   */
  list(): Observable<{ productDomain: ProductDomain[] }> {
    return this.httpClient.get<{ productDomain: ProductDomain[] }>(`/bp/products`);
  }

  /**
   * Valida el ID de un producto.
   * @param id - ID del producto a validar.
   * @returns Observable con un booleano indicando si el ID es valido.
   */
  validateId(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`/bp/products/verification/${id}`);
  }

  /**
   * Crea un nuevo producto.
   * @param productDomain - Objeto ProductDomain con los datos del producto a crear.
   * @returns Observable con un objeto que contiene un mensaje y los datos del producto creado.
   */
  create(productDomain: ProductDomain): Observable<{ message: string, data: ProductDomain }> {
    return this.httpClient.post<{ message: string, data: ProductDomain }>(`/bp/products`, productDomain);
  }

  /**
   * Actualiza un producto existente.
   * @param productDomain - Objeto ProductDomain con los datos del producto a actualizar.
   * @returns Observable con un objeto que contiene un mensaje y los datos del producto actualizado.
   */
  update(productDomain: ProductDomain): Observable<{ message: string, data: ProductDomain }> {
    return this.httpClient.put<{
      message: string,
      data: ProductDomain
    }>(`/bp/products/${productDomain.properties().id}`, productDomain);
  }

  /**
   * Elimina un producto por su ID.
   * @param id - ID del producto a eliminar.
   * @returns Observable con un objeto que contiene un mensaje.
   */
  delete(id: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`/bp/products/${id}`);
  }

}
