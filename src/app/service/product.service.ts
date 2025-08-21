// app/service/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../interface/product.interface';

type Category = 'fruit' | 'vegetable';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private fruits: Product[] = [];
  private vegetables: Product[] = [];

  constructor(private http: HttpClient) {}

  // המרת "5$" -> 5 (פשוטה)
  private parsePrice(p: string | number): number {
    if (typeof p === 'number') return p;
    return parseFloat((p || '').replace(/[^0-9.]/g, '')) || 0;
  }

  /** טוען מה-JSON. קוראים פעם אחת באתחול */
  load(url = 'assets/data/products.json'): Observable<void> {
    return this.http.get<any>(url).pipe(
      map(raw => ({
        fruits: (raw?.fruits ?? []).map((f: any) => ({
          name: f.name,
          imageUrl: f.imageUrl,
          price: this.parsePrice(f.price),
          link: f.link,
          category: 'fruit' as const
        })),
        vegetables: (raw?.vegetables ?? []).map((v: any) => ({
          name: v.name,
          imageUrl: v.imageUrl,
          price: this.parsePrice(v.price),
          link: v.link,
          category: 'vegetable' as const
        })),
      })),
      tap(({ fruits, vegetables }) => {
        this.fruits = fruits;
        this.vegetables = vegetables;
      }),
      map(() => void 0)
    );
  }

  /** מחזירים את המערכים לשימוש בתבנית */
  getFruits(): Product[]      { return this.fruits; }
  getVegetables(): Product[]  { return this.vegetables; }

  /** הוספה/מחיקה בסיסיות */
  addProduct(p: Product): void {
    p.price = this.parsePrice(p.price as any);
    if (p.category === 'fruit')      this.fruits = [...this.fruits, p];
    else if (p.category === 'vegetable') this.vegetables = [...this.vegetables, p];
  }

  deleteProduct(name: string, category: Category): void {
    if (category === 'fruit')
      this.fruits = this.fruits.filter(x => x.name !== name);
    else
      this.vegetables = this.vegetables.filter(x => x.name !== name);
  }
}
