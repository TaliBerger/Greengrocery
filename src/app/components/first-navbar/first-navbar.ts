import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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
  
  showSignInNextToCart: boolean = false;   
  cartCount$!: Observable<number>;         
  auth: any;                               

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const routesWithSignIn = ['/vegetables', '/fruits', '/about'];
        this.showSignInNextToCart = routesWithSignIn.includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.auth = this.authService;
    this.cartCount$ = this.cartService.cartCount$;
  }
}
