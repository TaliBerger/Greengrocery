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
  { path: 'main-page', component: MainPage },

  // 1. הגדרת דף הבית תחת הנתיב 'main-page'
  { path: 'auto-form', component: AutoForm },

  // 2. הפנייה מחדש (Redirect): ניתוב הנתיב הריק ('/') ל-'main-page'
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },

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
  
  // נתיב קיצור לטופס
  {
    path: 'form',
    redirectTo: 'add-product',
    pathMatch: 'full'
  },

  // נתיב אחרון: כל נתיב לא מוכר יופנה לדף הבית
  { path: '**', redirectTo: 'main-page' }
];
