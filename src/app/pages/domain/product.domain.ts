/**
 * Interface que define las propiedades esenciales de un producto.
 */

interface Essential {
  id: string,
  name: string,
  description: string,
  logo: string,
  date_release: Date,
  date_revision: Date,
}

/**
 * Interface que define las propiedades opcionales de un producto.
 * Actualmente esta vacia.
 */
interface Optional {
}

/**
 * Interface que define las propiedades necesarias para actualizar un producto.
 */
interface Update {
  name: string,
  description: string,
  logo: string,
  date_release: Date,
  date_revision: Date,
}

/**
 * Tipo que combina las propiedades esenciales requeridas y las opcionales parciales.
 */
export type ProductProperties = Required<Essential> & Partial<Optional>

/**
 * Tipo que define las propiedades necesarias para actualizar un producto.
 */
export type ProductPropertiesUpdate = Required<Update>;


/**
 * Clase que representa el dominio de un producto.
 */
export class ProductDomain {
  private readonly id!: string;
  private name!: string;
  private description!: string;
  private logo!: string;
  private date_release!: Date;
  private date_revision!: Date;

  /**
   * Constructor de la clase ProductDomain.
   * @param productProperties - Propiedades del producto.
   */
  constructor(productProperties: ProductProperties) {
    Object.assign(this, productProperties);
  }

  /**
   * Metodo para obtener las propiedades del producto.
   * @returns Un objeto con las propiedades del producto.
   */
  properties() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      logo: this.logo,
      date_release: this.date_release,
      date_revision: this.date_revision,
    };
  }

  /**
   * Metodo para actualizar las propiedades del producto.
   * @param productPropertiesUpdate - Propiedades actualizadas del producto.
   */
  update(productPropertiesUpdate: ProductPropertiesUpdate): void {
    Object.assign(this, productPropertiesUpdate);
  }

}
