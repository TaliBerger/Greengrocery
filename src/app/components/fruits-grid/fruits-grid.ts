import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../interface/product.interface';

@Component({
  selector: 'app-fruits-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fruits-grid.html',
  styleUrls: ['./fruits-grid.css']
})
export class FruitsGrid {
  fruits: Product[] = [];

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.ps.load().subscribe(() => {
      this.fruits = this.ps.getFruits();
      console.log('Fruits loaded:', this.fruits.length, this.fruits);
    });
  }

  add(p: Product) { this.ps.addProduct(p); this.fruits = this.ps.getFruits(); }
  del(p: Product) { this.ps.deleteProduct(p.name, 'fruit'); this.fruits = this.ps.getFruits(); }

  track = (_: number, p: Product) => p.name;
}
