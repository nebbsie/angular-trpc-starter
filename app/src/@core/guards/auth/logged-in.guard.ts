import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth';

export const LoggedInGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requestedUrl = route.url.join('/');

  // User can access the page.
  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth'], {
    queryParams: {
      next: requestedUrl,
    },
  });
};
