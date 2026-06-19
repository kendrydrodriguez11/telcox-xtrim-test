import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HttpErrorState } from '../models/api-response.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error inesperado. Intente nuevamente.';

      if (error.status === 0) {
        message = 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.';
      } else if (error.error?.error?.message) {
        message = error.error.error.message;
      } else if (error.status === 404) {
        message = 'El recurso solicitado no fue encontrado.';
      } else if (error.status === 500) {
        message = 'Error interno del servidor. Intente nuevamente en unos momentos.';
      }

      const state: HttpErrorState = { status: error.status, message };
      return throwError(() => state);
    })
  );
};
