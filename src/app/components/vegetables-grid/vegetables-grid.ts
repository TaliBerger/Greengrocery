import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../interface/product.interface';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-vegetables-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vegetables-grid.html',
  styleUrls: ['./vegetables-grid.css']
})
export class VegetablesGrid {
  vegetables: Product[] = [];

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.ps.load().subscribe(() => {
      this.vegetables = this.ps.getVegetables();
      console.log('Vegetables loaded:', this.vegetables.length, this.vegetables);
    });
  }

  add(p: Product) {
    this.ps.addProduct(p);
    this.vegetables = this.ps.getVegetables();
  }

  del(p: Product) {
    this.ps.deleteProduct(p.name, 'vegetable');
    this.vegetables = this.ps.getVegetables();
  }

  addToCart(p: Product) {
    this.cart.addToCart(p);
    alert(`${p.name} added to cart!`);
  }

  track = (_: number, p: Product) => p.name;
}
