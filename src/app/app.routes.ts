import { Routes } from '@angular/router';
import { AutoForm } from './components/authForm/authForm';
import { AddProduct } from './components/add-product/add-product';
import { About } from './components/about/about';
import { FruitsGrid } from './components/fruits-grid/fruits-grid';
import { VegetablesGrid } from './components/vegetables-grid/vegetables-grid';
import { CartPage } from './components/cart-page/cart-page';
import { adminGuard, adminMatchGuard } from './guards/admin.guard';
import { MainPage } from './components/main-page/main-page';

export const routes: Routes = [
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },
  { path: 'main-page', component: MainPage },
  { path: 'authForm', component: AutoForm },
  { path: 'vegetables', component: VegetablesGrid },
  { path: 'fruits', component: FruitsGrid },
  { path: 'add-product', component: AddProduct, canMatch: [adminMatchGuard], canActivate: [adminGuard] },
  { path: 'about', component: About },
  { path: 'cart', component: CartPage },
  { path: 'form', redirectTo: 'add-product', pathMatch: 'full' },
  { path: '**', redirectTo: 'main-page' }
];
