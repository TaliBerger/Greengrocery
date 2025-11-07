import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  // מזריק את ה-Router לתוך ה-constructor
  constructor(private router: Router) {} 

  // פונקציה שתופעל בלחיצה על הכפתור
  onShopNowClick() {
    // מנווט לנתיב 'vegetables'
    this.router.navigate(['/vegetables']); 
  }
}
