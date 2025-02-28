import {ProductDomain} from './product.domain';
import {Observable} from 'rxjs';

/**
 * Interfaz para el repositorio de productos.
 */
export interface IProductRepository {

  /**
   * Lista todos los productos.
   * @returns {Observable<{ data: [] }>} Un observable que emite una lista de datos.
   */
  list(): Observable<{ data: [] }>;

  /**
   * Valida el ID de un producto.
   * @param {string} id - El ID del producto a validar.
   * @returns {Observable<boolean>} Un observable que emite un valor booleano indicando si el ID es valido.
   */
  validateId(id: string): Observable<boolean>;

  /**
   * Crea un nuevo producto.
   * @param {ProductDomain} productDomain - El producto a crear.
   * @returns {Observable<{ message: string, data: ProductDomain }>} Un observable que emite un mensaje y los datos del producto creado.
   */
  create(productDomain: ProductDomain): Observable<{ message: string, data: ProductDomain }>;

  /**
   * Actualiza un producto existente.
   * @param {ProductDomain} productDomain - El producto a actualizar.
   * @returns {Observable<{ message: string, data: ProductDomain }>} Un observable que emite un mensaje y los datos del producto actualizado.
   */
  update(productDomain: ProductDomain): Observable<{ message: string, data: ProductDomain }>;

  /**
   * Elimina un producto por su ID.
   * @param {string} id - El ID del producto a eliminar.
   * @returns {Observable<{ message: string }>} Un observable que emite un mensaje indicando el resultado de la operacion.
   */
  delete(id: string): Observable<{ message: string }>;

}
