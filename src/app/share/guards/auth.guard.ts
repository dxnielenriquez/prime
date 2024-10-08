import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, of} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.hasAccess().pipe(
    catchError((error) => {
      if (error.status === 400) {
        return of(false);
      } else {

        router.navigate(['/login']).then();
        return of(false);
      }
    })
  );
};
