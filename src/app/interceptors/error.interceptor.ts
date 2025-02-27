import {HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {inject} from '@angular/core';
import {ModalService} from '../services/modal.service';

interface ValidationError {
  constraints: {
    [key: string]: string;
  };
}

interface ErrorResponse {
  message?: string;
  errors?: ValidationError[];
}

/**
 * Interceptor de errores HTTP.
 *
 * @param req - La solicitud HTTP.
 * @param next - El siguiente manejador en la cadena de interceptores.
 * @returns Un observable que puede emitir eventos HTTP.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ModalService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error HTTP interceptado:', error);
      let errorMessage = 'Error desconocido';
      const errorBody = error.error as ErrorResponse;
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      } else if (errorBody?.errors?.[0]?.constraints) {
        const constraintValues = Object.values(errorBody.errors[0].constraints);
        if (constraintValues.length > 0) {
          errorMessage = constraintValues[0];
        }
      }
      modalService.message = errorMessage;
      modalService.notificacion = true;
      modalService.showModal = true;
      return throwError(() => errorMessage);
    }),
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (event.body?.message) {
          modalService.message = event.body.message;
          modalService.notificacion = true;
          modalService.showModal = true;
        }
      }
    })
  );
};
