import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  constructor(private router: Router) {} 

  onShopNowClick() {
    this.router.navigate(['/vegetables']); 
  }
}
