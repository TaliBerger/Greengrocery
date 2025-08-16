import { Routes } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { AddProduct } from './components/add-product/add-product';
import { About } from './components/about/about';
import { FruitsGrid } from './components/fruits-grid/fruits-grid';
import { VegetablesGrid } from './components/vegetables-grid/vegetables-grid';

export const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'Vegetables_Section', component: VegetablesGrid },
  { path: 'Fruits_Section', component: FruitsGrid },
  { path: 'form', component: AddProduct },
  { path: 'about', component: About },
  { path: 'add-product', component: AddProduct },


];
