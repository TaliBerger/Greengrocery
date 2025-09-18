import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service'; 
function checkAdmin(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin) return true;

  alert(auth.isLoggedIn ? 'Access denied' : 'Please log in to place an order');
  return router.createUrlTree(['/']); 
}

export const adminGuard: CanActivateFn = () => checkAdmin();
export const adminMatchGuard: CanMatchFn = () => checkAdmin();
