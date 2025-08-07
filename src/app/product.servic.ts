import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private fruits: Product[] = []; // רשימת פירות
  private vegetables: Product[] = []; // רשימת ירקות

  constructor(private http: HttpClient) {}

  // החזרת הפירות כ-Observable
  getFruits(): Observable<Product[]> {
    return of(this.fruits); // מחזיר את המערך ישירות
  }

  // החזרת הירקות כ-Observable
  getVegetables(): Observable<Product[]> {
    return of(this.vegetables); // מחזיר את המערך ישירות
  }

  // הוספת מוצר
  addProduct(product: Product): void {
    if (!product.name || !product.category || isNaN(Number(product.price))) {
      console.error('Invalid product details:', product);
      return;
    }

    product.price = Number(product.price); // המרת מחיר למספר

    if (product.category === 'fruit') {
      this.fruits.push(product);
      console.log('Fruit added:', product);
    } else if (product.category === 'vegetable') {
      this.vegetables.push(product);
      console.log('Vegetable added:', product);
    } else {
      console.error('Invalid category for product', product);
    }
  }

  // מחיקת מוצר לפי שם וקטגוריה
  deleteProduct(name: string, category: string): void {
    if (!name || !category) {
      console.error('Invalid delete parameters:', { name, category });
      return;
    }

    if (category === 'fruit') {
      this.fruits = this.fruits.filter(fruit => fruit.name !== name);
      console.log('Fruit deleted:', name);
    } else if (category === 'vegetable') {
      this.vegetables = this.vegetables.filter(vegetable => vegetable.name !== name);
      console.log('Vegetable deleted:', name);
    } else {
      console.error('Invalid category for deletion:', { name, category });
    }
  }

  // טעינת נתונים מתוך קובץ JSON
  loadProductsFromJson(): Observable<any> {
    return this.http.get<any>('assets/data/products.json').pipe(
      catchError((error) => {
        console.error('Error loading products from JSON:', error);
        return of({ fruits: [], vegetables: [] }); // מחזיר מבנה ריק במקרה של שגיאה
      })
    );
  }

  // הפרדת נתונים לפירות וירקות
  separateFruitsAndVegetables(data: any): void {
    if (this.fruits.length === 0 && this.vegetables.length === 0) {
      this.fruits = data.fruits || [];
      this.vegetables = data.vegetables || [];
    }
  }
}