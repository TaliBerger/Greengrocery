import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';

const PRODUCTS_URL = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private fruits: Product[] = [];
  private vegetables: Product[] = [];

  constructor(private http: HttpClient) {}

  load(): Observable<void> {
    return this.http.get<Product[]>(PRODUCTS_URL).pipe(
      tap(rows => {
        const items = rows ?? [];
        this.fruits     = items.filter(r => r.category === 'fruit');
        this.vegetables = items.filter(r => r.category === 'vegetable');
      }),
      map(() => void 0)
    );
  }

  getFruits()     { return this.fruits; }
  getVegetables() { return this.vegetables; }

  addProduct(p: Product): void {
    const body: Omit<Product, 'id'> = {
      name: p.name,
      price: p.price,
      link: p.link,
      category: p.category,
      emoji: p.emoji,
    };
    this.http.post<Product>(PRODUCTS_URL, body).subscribe({
      next: saved => {
        if (saved.category === 'fruit') this.fruits = [...this.fruits, saved];
        else this.vegetables = [...this.vegetables, saved];
      },
      error: e => console.error('[ProductService] addProduct failed', e),
    });
  }

  updateProduct(id: string, patch: Partial<Product>): void {
    this.http.patch<Product>(`${PRODUCTS_URL}/${id}`, patch).subscribe({
      next: saved => {
        const replaceIn = (arr: Product[]) => arr.map(x => x.id === id ? saved : x);
        const wasFruit = this.fruits.some(x => x.id === id);
        this.fruits = replaceIn(this.fruits);
        this.vegetables = replaceIn(this.vegetables);

        const nowFruit = saved.category === 'fruit';
        if (wasFruit && !nowFruit) {
          this.fruits = this.fruits.filter(x => x.id !== id);
          if (this.vegetables.every(x => x.id !== id)) this.vegetables = [...this.vegetables, saved];
        } else if (!wasFruit && nowFruit) {
          this.vegetables = this.vegetables.filter(x => x.id !== id);
          if (this.fruits.every(x => x.id !== id)) this.fruits = [...this.fruits, saved];
        }
      },
      error: e => console.error('[ProductService] updateProduct failed', e),
    });
  }

  deleteProduct(name: string, category: Category): void {
    const params = new HttpParams().set('name', name).set('category', category);
    this.http.get<Product[]>(PRODUCTS_URL, { params }).subscribe({
      next: rows => {
        const hit = rows?.[0]; if (!hit?.id) return;
        this.http.delete(`${PRODUCTS_URL}/${hit.id}`).subscribe({
          next: () => {
            if (category === 'fruit') this.fruits = this.fruits.filter(x => x.id !== hit.id);
            else this.vegetables = this.vegetables.filter(x => x.id !== hit.id);
          },
          error: e => console.error('[ProductService] deleteProduct: delete failed', e),
        });
      },
      error: e => console.error('[ProductService] deleteProduct: find failed', e),
    });
  }

  findByNameCategory(name: string, category: Category) {
    const params = new HttpParams().set('name', name).set('category', category);
    return this.http.get<Product[]>(PRODUCTS_URL, { params });
  }
}
