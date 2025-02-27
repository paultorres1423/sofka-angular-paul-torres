import {Injectable} from '@angular/core';

/**
 * Servicio para manejar la logica de los modales en la aplicacion.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  message: string = 'Mensaje';
  private _showModal: boolean = false;
  private _notificacion: boolean = false;
  private _resolve!: (value: boolean) => void;

  /**
   * Confirma la accion del modal y cierra el modal.
   */
  confirm() {
    this._resolve(true);
    this.close();
    this.notificacion = false;
  }

  /**
   * Cancela la accion del modal y cierra el modal.
   */
  cancel() {
    this._resolve(false);
    this.close();
    this.notificacion = false;
  }


  /**
   * Cierra el modal.
   */
  private close() {
    this._showModal = false;
  }

  /**
   * Obtiene el estado de visibilidad del modal.
   */
  get showModal(): boolean {
    return this._showModal;
  }

  /**
   * Establece el estado de visibilidad del modal.
   */
  set showModal(value: boolean) {
    this._showModal = value;
  }

  /**
   * Obtiene el estado de la notificacion.
   */
  get notificacion(): boolean {
    return this._notificacion;
  }

  /**
   * Establece el estado de la notificacion.
   */
  set notificacion(value: boolean) {
    this._notificacion = value;
  }

  /**
   * Abre el modal con un mensaje especifico.
   * @param message El mensaje a mostrar en el modal.
   * @returns Una promesa que se resuelve con un valor booleano indicando la accion del usuario.
   */
  openModal(message: string): Promise<boolean> {
    this.message = message;
    this._showModal = true;
    return new Promise<boolean>(resolve => {
      this._resolve = resolve;
    });
  }

}
