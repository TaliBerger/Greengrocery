import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { Product } from '../../interface/product.interface';

@Component({
  selector: 'app-fruits-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fruits-grid.html',
  styleUrls: ['./fruits-grid.css'],
})
export class FruitsGrid {
  fruits: Product[] = [];
  qtyInput: Record<string, number> = {};

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.ps.load().subscribe(() => {
      this.fruits = this.ps.getFruits();
      console.log('Fruits loaded:', this.fruits.length, this.fruits);
    });
  }

  // ---- helpers (כל אחת פעם אחת בלבד) ----
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
    // אם ה-CartService שלך מקבל פרמטר אחד בלבד, החליפי לשורה: this.cart.addToCart(p);
    this.cart.addToCart(p, q);
    this.qtyInput[k] = 1;
  }

  onImgError(ev: Event, p: Product): void {
    const img = ev.target as HTMLImageElement;
    // ניסיון אחד בלבד לפלייסהולדר כדי לא להיכנס ללולאות
    img.onerror = null;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(p.category + '-' + p.name)}/600/450`;
  }
}
