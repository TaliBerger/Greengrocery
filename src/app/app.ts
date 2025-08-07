import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './main-page/home';
import { FruitsGrid } from './fruits-grid/fruits-grid';

@Component({
  selector: 'app-root',
  imports: [Home,FruitsGrid], //RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('greengrocery');
}
