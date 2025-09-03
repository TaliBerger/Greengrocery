 import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  getCart() {
    return this.cart;
  }

  addToCart(product: any) {
    this.cart.push(product);
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  clearCart() {
    this.cart = [];
  }
}
