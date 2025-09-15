import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart.service';  // ייבוא ה־CartService

@Component({
  selector: 'app-first-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './first-navbar.html',
  styleUrls: ['./first-navbar.css']
})
export class FirstNavbar {
  cartCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
}
