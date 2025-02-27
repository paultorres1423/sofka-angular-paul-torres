import {Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {ProductListComponent} from './interface/product-list/product-list.component';
import {ProductFormComponent} from './interface/product-form/product-form.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: 'product-list', component: ProductListComponent},
      {path: 'product-form', component: ProductFormComponent},
    ]
  },
];
