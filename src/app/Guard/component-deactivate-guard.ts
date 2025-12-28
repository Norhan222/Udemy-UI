import { CanActivateFn } from '@angular/router';

export const componentDeactivateGuard: CanActivateFn = (route, state) => {
  return true;
};
