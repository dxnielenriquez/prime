import {HttpInterceptorFn} from '@angular/common/http';
import {environment} from "../../../environments/environment";

export const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {

  let baseUrl = environment.api.baseUrl;

  if(request.url == 'login' || request.headers.get('noWeb'))
    baseUrl = environment.api.baseUrl.replace('/web','');


  if (request.url.startsWith('http', 0) || request.url.startsWith('https', 0) || request.headers.get('noInterceptUrl')) {
    return next(request);
  }

  request = request.clone({
    url: `${baseUrl}/${request.url}`
  });

  return next(request);
};
