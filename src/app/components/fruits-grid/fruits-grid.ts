import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-fruits-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fruits-grid.html',
  styleUrls: ['./fruits-grid.css'],
})
export class FruitsGrid implements OnInit {
  fruits: Product[] = [];
  qtyInput: Record<string, number> = {};

  constructor(
    private ps: ProductService,
    private cart: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.ps.load().subscribe(() => {
      this.fruits = this.ps.getFruits();
    });
  }

  track = (_: number, p: Product) => p.name;

  keyOf(p: Product): string {
    return `${p.name}|${p.category}|${p.price}`;
  }

  incQty(p: Product) {
    const k = this.keyOf(p);
    this.qtyInput[k] = Math.min(999, (this.qtyInput[k] || 1) + 1);
  }

  decQty(p: Product) {
    const k = this.keyOf(p);
    const next = (this.qtyInput[k] || 1) - 1;
    this.qtyInput[k] = Math.max(1, next);
  }

  onQtyInput(p: Product, val: any) {
    const k = this.keyOf(p);
    const n = Math.floor(Number(val));
    this.qtyInput[k] = Number.isFinite(n) && n > 0 ? n : 1;
  }

  confirmQty(p: Product) {
    const k = this.keyOf(p);
    const q = this.qtyInput[k] || 1;
    this.cart.addToCart(p, q);
    this.qtyInput[k] = 1;
  }

  onImgError(ev: Event, p: Product): void {
    const img = ev.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(p.category + '-' + p.name)}/600/450`;
  }
}
