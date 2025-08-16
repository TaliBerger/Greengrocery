import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { Product } from '../../interface/product.interface';

@Component({
  selector: 'app-vegetables-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vegetables-grid.html',
  styleUrl: './vegetables-grid.css'
})
export class VegetablesGrid  implements OnInit, OnDestroy {
  vegetables: Product[] = [];
  private vegetablesSubscription!: Subscription; // מנוי
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // טעינת נתונים מקובץ JSON
    this.productService.loadProductsFromJson().subscribe((data: any) => {
      this.productService.separateFruitsAndVegetables(data);
    });

    // מנוי ל-Observable כדי לעדכן את רשימת הירקות
    this.vegetablesSubscription = this.productService.getVegetables().subscribe((vegetables: Product[]) => {
      this.vegetables = vegetables;
      console.log('Updated vegetables:', this.vegetables);
    });
  }

  ngOnDestroy(): void {
    // ביטול המנוי למניעת זליגת זיכרון
    if (this.vegetablesSubscription) {
      this.vegetablesSubscription.unsubscribe();
    }
  }
}