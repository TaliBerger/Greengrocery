import { Routes } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { AddProduct } from './components/add-product/add-product';
import { About } from './components/about/about';
import { FruitsGrid } from './components/fruits-grid/fruits-grid';
import { VegetablesGrid } from './components/vegetables-grid/vegetables-grid';
import { CartPage } from './components/cart-page/cart-page';
import { adminGuard, adminMatchGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'vegetables', component: VegetablesGrid },
  { path: 'fruits', component: FruitsGrid },
  {
    path: 'add-product',
    component: AddProduct,
    canMatch: [adminMatchGuard],
    canActivate: [adminGuard],
  },
  { path: 'about', component: About },
  { path: 'cart', component: CartPage },
  // app.routes.ts
  {
    path: 'form',
    redirectTo: 'add-product',
    pathMatch: 'full'
  },

  { path: '**', redirectTo: '' }
];
