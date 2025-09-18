import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../service/auth.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-first-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './first-navbar.html',
  styleUrls: ['./first-navbar.css']
})
export class FirstNavbar implements OnInit {
  // חייב להיות public כדי שהטמפלט ייגש אליו
  constructor(public auth: AuthService, private cart: CartService) {}

  cartCount$!: Observable<number>;

  ngOnInit(): void {
    this.cartCount$ = this.cart.cartCount$; // Observable<number>
  }

  logout(): void {
    this.auth.logout();
  }
}
