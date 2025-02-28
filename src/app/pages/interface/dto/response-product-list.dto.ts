/**
 * Clase que representa la respuesta de una lista de productos.
 */
export class ResponseProductListDto {
  data: Response[];

  constructor() {
    this.data = [];
  }
  
}

/**
 * Clase que representa la respuesta de un producto individual.
 */
class Response {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;

  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.logo = '';
    this.date_release = new Date()
    this.date_revision = new Date()
  }
}
