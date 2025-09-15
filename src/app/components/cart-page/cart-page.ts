import { Component } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage {
  cart: CartItem[] = [];
  
  showSuccess = false;
  orderId: string | null = null;

  constructor(
    private cartService: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  // trackBy לפתרון האזהרה/ביצועים
  track = (_: number, ci: CartItem) => ci.product.name;

  removeItem(i: number) {
    this.cartService.removeLine(i);
    this.cart = this.cartService.getCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cart = [];
  }

  get totalPrice() {
    return this.cartService.getTotalPrice();
  }

  submitOrder() {
    // חסימה אם לא מחובר/ת
    if (!this.auth.isLoggedIn) {
      alert('יש להיכנס למערכת לפני שליחת הזמנה');
      return;
    }
    if (!this.cart.length) return;

    // פופ־אפ הצלחה + ניקוי סל
    this.orderId = Date.now().toString(36).toUpperCase();
    this.cartService.clearCart();
    this.cart = [];
    this.showSuccess = true;
  }

  closePopup() { this.showSuccess = false; }

  increase(i: number) {
    this.cartService.increase(i);
    this.cart = this.cartService.getCart();
  }

  decrease(i: number) {
    this.cartService.decrease(i);
    this.cart = this.cartService.getCart();
  }

  setQty(i: number, val: any) {
    const n = Math.floor(Number(val));
    this.cartService.setQty(i, Number.isFinite(n) && n > 0 ? n : 1);
    this.cart = this.cartService.getCart();
  }
}
