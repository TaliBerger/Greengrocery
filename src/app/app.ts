import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { FruitsGrid } from "./components/fruits-grid/fruits-grid";
import { VegetablesGrid } from "./components/vegetables-grid/vegetables-grid";
import { AddProduct } from "./components/add-product/add-product";
import { About } from "./components/about/about";
import { FirstNavbar } from "./components/first-navbar/first-navbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainPage, FirstNavbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('greengrocery');
}
