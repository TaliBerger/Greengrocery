import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//import { Product } from '../models/product.interface';
//import { ProductService } from '../services/product.service';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fruits-grid',
  standalone : true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fruits-grid.html',
  styleUrl: './fruits-grid.css'
})
export class FruitsGrid implements OnInit, OnDestroy {
  fruits: Product[] = [];
  private fruitsSubscription!: Subscription; // מנוי לנתוני הפירות

 // constructor(private productService: ProductService) {}

  ngOnInit(): void {
  // טעינת נתונים ראשונית מקובץ JSON
    this.productService.loadProductsFromJson().subscribe((data) => {
    this.productService.separateFruitsAndVegetables(data);
    });
    
    // מנוי לנתוני הפירות
    this.fruitsSubscription = this.productService.getFruits().subscribe((fruits) => {
    this.fruits = fruits; // עדכון רשימת הפירות
      console.log('Updated fruits:', this.fruits);
    });
  }

  ngOnDestroy(): void {
    if (this.fruitsSubscription) {
      this.fruitsSubscription.unsubscribe();
    }
  }
}
