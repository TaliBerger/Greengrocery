import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';

export interface CartItem {
  product: Product;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0); // סה״כ יחידות בעגלה
  cartCount$ = this.cartCount.asObservable();

  private sameItem(a: Product, b: Product) {
    return a.name === b.name && a.category === b.category;
  }

  private recalcCount() {
    const total = this.cart.reduce((sum, it) => sum + it.qty, 0);
    this.cartCount.next(total);
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  addToCart(product: Product, qty: number = 1) {
    if (qty <= 0) return;
    const idx = this.cart.findIndex(ci => this.sameItem(ci.product, product));
    if (idx >= 0) {
      this.cart[idx] = { ...this.cart[idx], qty: this.cart[idx].qty + qty };
    } else {
      this.cart = [...this.cart, { product, qty }];
    }
    this.recalcCount();
  }

  removeLine(index: number) {
    this.cart.splice(index, 1);
    this.cart = [...this.cart];
    this.recalcCount();
  }

  clearCart() {
    this.cart = [];
    this.recalcCount();
  }

  getTotalPrice(): number {
    return this.cart.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  }

setQty(index: number, qty: number) {
  if (!this.cart[index]) return;
  const next = Math.floor(Number(qty));
  if (!Number.isFinite(next) || next <= 0) {
    this.removeLine(index);
  } else {
    this.cart[index] = { ...this.cart[index], qty: next };
  }
  this.cart = [...this.cart];
  this.recalcCount();
}

increase(index: number) {
  if (!this.cart[index]) return;
  this.cart[index] = { ...this.cart[index], qty: this.cart[index].qty + 1 };
  this.cart = [...this.cart];
  this.recalcCount();
}

decrease(index: number) {
  if (!this.cart[index]) return;
  const next = this.cart[index].qty - 1;
  if (next <= 0) this.removeLine(index);
  else this.cart[index] = { ...this.cart[index], qty: next };
  this.cart = [...this.cart];
  this.recalcCount();
}

}

