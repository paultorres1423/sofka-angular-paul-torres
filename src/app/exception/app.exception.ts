import {inject} from '@angular/core';
import {ModalService} from '../services/modal.service';

/**
 * Clase que representa una excepcion personalizada para la aplicacion.
 * Extiende de la clase Error.
 */
export class AppException extends Error {
  modalService = inject(ModalService);

  /**
   * Constructor de la clase AppException.
   * @param {string} message - El mensaje de error.
   */
  constructor(
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppException.prototype);
    this.name = 'ERROR_FRONTEND';
    this.modalService.message = message;
    this.modalService.notificacion = true;
    this.modalService.showModal = true;
  }

}
