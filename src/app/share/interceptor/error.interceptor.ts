import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ModalErrorComponent} from "../components/modals/modal-error/modal-error.component";
import {Footer} from "../components/modals/footer";
import {AuthService} from "../services/auth.service";

enum StatusCode {
  unknownError = 0,
  Unauthorized = 401,
  Forbidden = 403,
  Notfound = 404,
  Unprocessable = 422,
  TooManyRequests = 429,
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {

  if (request.headers.get('noIntercept') === 'true') {
    return next(request);
  }

  const dialog = inject(DialogService);
  const auth = inject(AuthService);
  let headerMsg = '';
  let errorMsg = '';
  let message = {headerMsg, errorMsg}
  let ref: DynamicDialogRef | undefined;

  return next(request).pipe(
    catchError((err) => {
      switch (err.status) {
        case StatusCode.Unauthorized:
          message = unauthorized(err, auth);
          break;
        case StatusCode.Forbidden:
          message = forbidden(err);
          break;
        case StatusCode.Notfound:
          message = notFound(err);
          break;
        case StatusCode.Unprocessable:
          message = unprocessableEntity(err);
          break;
        case StatusCode.TooManyRequests:
          message = tooManyRequests(err);
          break;
        default:
          message = {headerMsg: 'Error de conexión', errorMsg: 'Ocurrió un error inesperado'}
          break;
      }

      ref = dialog.open(ModalErrorComponent,
        {
          header: message.headerMsg,
          width: '40vw',
          height: '40vh',
          contentStyle: {overflow: 'auto'},
          breakpoints: {
            '991px': '75vw',
            '640px': '90vw'
          },
          templates: {
            footer: Footer
          },
          data: {
            errorMessage: message.errorMsg
          }
        })

      ref.onClose.subscribe((data: any) => {
        // window.location.reload();
      })
      return throwError(() => err)
    })
  )

};

function unauthorized(err: HttpErrorResponse, auth: any) {

  const headerMsg: string = err.error.message || 'Error';
  const errorMsg: string = err.error.error;

  if (errorMsg != "Usuario y/o contraseña incorrectos") {
    auth.logout();
  }

  if (errorMsg === 'Token not provided') {
    window.location.reload();
  }

  return {headerMsg, errorMsg};
}

function forbidden(err: HttpErrorResponse) {
  const headerMsg = err.error.message || 'Error';
  const errorMsg = err.error.error;

  return {headerMsg, errorMsg};
}

function notFound(err: HttpErrorResponse) {
  const headerMsg = err.error.message || 'Error';
  const errorMsg = err.error.error;

  return {headerMsg, errorMsg};
}

function unprocessableEntity(err: HttpErrorResponse) {

  const headerMsg = err.error.message || 'Error';
  const errors: string[] = err.error.errors;
  const errorMsg = errors.join(',') || 'Ocurrió un error';

  return {headerMsg, errorMsg};
}

function tooManyRequests(err: HttpErrorResponse) {
  const headerMsg = 'Error';
  const errorMsg = 'Demasiados intentos. Espere un momento.';

  return {headerMsg, errorMsg};
}
