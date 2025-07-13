import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.getAccessToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`} })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return from(authService.getRefreshToken()).pipe(
              switchMap((refreshToken) => {
                if (!refreshToken) {
                  authService.clearTokens();
                  router.navigate(['/login']);
                  return throwError(() => error);
                }
                
                return from(authService.refreshAccessToken(refreshToken)).pipe(
                  switchMap((newAccessToken) => {
                    const retryReq = req.clone({
                      setHeaders: { Authorization: `Bearer ${newAccessToken}` },
                    });
                    return next(retryReq);
                  }),
                  catchError(() => {
                    authService.clearTokens();
                    router.navigate(['/login']);
                    return throwError(() => error);
                  })
                );
              })
            );
          }

          return throwError(() => error);
        })
      );
    })
  );
};
