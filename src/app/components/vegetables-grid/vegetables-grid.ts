import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ← חשוב!
import { ProductService } from '../../service/product.service';
import { Product } from '../../interface/product.interface';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-vegetables-grid',
  standalone: true,
  imports: [CommonModule], // ← זה מספק *ngFor ו-*ngIf
  templateUrl: './vegetables-grid.html',
  styleUrls: ['./vegetables-grid.css']
})
export class VegetablesGrid {
  vegetables: Product[] = [];

  qtyPickerFor: string | null = null;
  qtyInput: Record<string, number> = {};

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.ps.load().subscribe(() => {
      this.vegetables = this.ps.getVegetables();
    });
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
