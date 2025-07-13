import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'auth',
    loadChildren: () => import('./mdl-auth/mdl-auth-module').then(m => m.MdlAuthModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./mdl-account/mdl-account-module').then(m => m.MdlAccountModule)
  },
  { path: '',        redirectTo: 'account/index', pathMatch: 'full' },
  { path: '',      redirectTo: 'account/index', pathMatch: 'full' }
];
