import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-vegetables-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vegetables-grid.html',
  styleUrls: ['./vegetables-grid.css']
})
export class VegetablesGrid implements OnInit {
  vegetables: Product[] = [];

  qtyPickerFor: string | null = null;
  qtyInput: Record<string, number> = {};

  constructor(
    private ps: ProductService,
    private cart: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    // ✅ אם יש שירות טעינה – נטען ממנו
    this.ps.load().subscribe(() => {
      this.vegetables = this.ps.getVegetables();
    });

    // ✅ אם אין – נטען ידנית דוגמה
    if (this.vegetables.length === 0) {
      this.vegetables = [
        {
          name: 'Tomato',
          price: 3.5,
          category: 'vegetable',
          image: 'assets/images/vegetables/tomato.jpg',
          link: 'https://en.wikipedia.org/wiki/Tomato',
          emoji: ''
        },
        {
          name: 'Carrot',
          price: 4.2,
          category: 'vegetable',
          image: 'assets/images/vegetables/carrot.jpg',
          link: 'https://en.wikipedia.org/wiki/Carrot',
          emoji: ''
        },
        {
          name: 'Cucumber',
          price: 3.0,
          category: 'vegetable',
          image: 'assets/images/vegetables/cucumber.jpg',
          link: 'https://en.wikipedia.org/wiki/Cucumber',
          emoji: ''
        },
        {
          name: 'Lettuce',
          price: 2.8,
          category: 'vegetable',
          image: 'assets/images/vegetables/lettuce.jpg',
          link: 'https://en.wikipedia.org/wiki/Lettuce',
          emoji: ''
        },
        {
          name: 'Broccoli',
          price: 5.4,
          category: 'vegetable',
          image: 'assets/images/vegetables/broccoli.jpg',
          link: 'https://en.wikipedia.org/wiki/Broccoli',
          emoji: ''
        },
        {
          name: 'Onion',
          price: 2.6,
          category: 'vegetable',
          image: 'assets/images/vegetables/onion.jpg',
          link: 'https://en.wikipedia.org/wiki/Onion',
          emoji: ''
        },
        {
          name: 'Potato',
          price: 3.1,
          category: 'vegetable',
          image: 'assets/images/vegetables/potato.jpg',
          link: 'https://en.wikipedia.org/wiki/Potato',
          emoji: ''
        },
        {
          name: 'Zucchini',
          price: 4.7,
          category: 'vegetable',
          image: 'assets/images/vegetables/zucchini.jpg',
          link: 'https://en.wikipedia.org/wiki/Zucchini',
          emoji: ''
        }
      ];
    }
  }

  track = (_: number, p: Product) => p.name;

  keyOf(p: Product): string {
    return `${p.name}|${p.category}|${p.price}`;
  }

  openQtyPicker(p: Product) {
    const k = this.keyOf(p);
    this.qtyInput[k] = this.qtyInput[k] || 1;
    this.qtyPickerFor = k;
  }
  closeQtyPicker() { this.qtyPickerFor = null; }

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
    this.qtyPickerFor = null;
  }

  onImgError(ev: Event, p: Product): void {
    const img = ev.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(p.category + '-' + p.name)}/600/450`;
  }
}
