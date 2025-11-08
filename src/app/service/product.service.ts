import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, switchMap, of } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';

const PRODUCTS_URL = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsLoaded = false;
  private fruits: Product[] = [];
  private vegetables: Product[] = [];

  constructor(private http: HttpClient) {}

  load(): Observable<Product[]> {
    if (this.productsLoaded) {
      return of([...this.fruits, ...this.vegetables]); 
    }

    return this.http.get<Product[]>(PRODUCTS_URL).pipe(
      tap(rows => {
        const items = rows ?? [];
        this.fruits     = items.filter(r => r.category === 'fruit');
        this.vegetables = items.filter(r => r.category === 'vegetable');
        
        this.productsLoaded = true;
      })
    );
  }

  getFruits()     { return this.fruits; }
  getVegetables() { return this.vegetables; }

  addProduct(p: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(PRODUCTS_URL, p).pipe(
      tap(saved => {
        if (saved.category === 'fruit') this.fruits = [...this.fruits, saved];
        else                             this.vegetables = [...this.vegetables, saved];
      })
    );
  }

  deleteByNameCategory(name: string, category: Category): Observable<void> {
    const params = new HttpParams().set('name', name).set('category', category);
    return this.http.get<Product[]>(PRODUCTS_URL, { params }).pipe(
      map(list => list?.[0]),
      switchMap(hit => {
        if (!hit?.id) throw new Error('Product not found');
        return this.http.delete<void>(`${PRODUCTS_URL}/${hit.id}`).pipe(
          tap(() => {
            if (category === 'fruit') this.fruits = this.fruits.filter(x => x.id !== hit.id);
            else                      this.vegetables = this.vegetables.filter(x => x.id !== hit.id);
          })
        );
      })
    );
  }
}