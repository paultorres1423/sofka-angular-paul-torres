import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'product-list',
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.routes').then(feature => feature.routes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'page-not-found',
  },
];
