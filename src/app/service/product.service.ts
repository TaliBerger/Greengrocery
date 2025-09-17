// src/app/service/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';

/** כתובת מלאה ל־products (עם /api/v1 ועם /products בסוף) */
const PRODUCTS_URL = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private fruits: Product[] = [];
  private vegetables: Product[] = [];

  constructor(private http: HttpClient) {
    // דיבוג (אפשר למחוק):
    // console.log('[ProductService] PRODUCTS_URL =', PRODUCTS_URL);
  }

  /** ───── Helpers ───── */
  private parsePrice(p: string | number): number {
    if (typeof p === 'number') return p;
    return parseFloat((p || '').replace(/[^0-9.]/g, '')) || 0;
  }

  private ensureImageUrl(p: Product): string {
    const url = (p.imageUrl ?? '').trim();
    const isHttp = /^https?:\/\//i.test(url);
    if (isHttp && url) return url;
    const seed = encodeURIComponent(`${p.category}-${p.name}`.toLowerCase());
    const tag1 = encodeURIComponent((p.category || '').toLowerCase());
    const tag2 = encodeURIComponent((p.name || '').toLowerCase());
    return `https://loremflickr.com/seed/${seed}/600/450/${tag1},${tag2}`;
  }

  /** ───── API ───── */

  /** טעינה ושמירה במטמון */
  load(): Observable<void> {
    return this.http.get<Product[]>(PRODUCTS_URL).pipe(
      map((rows: Product[]) =>
        (rows ?? []).map((r) => ({
          ...r,
          price: this.parsePrice(r.price as any),
          imageUrl: this.ensureImageUrl(r),
        }))
      ),
      tap((rows: Product[]) => {
        this.fruits     = rows.filter(r => r.category === 'fruit');
        this.vegetables = rows.filter(r => r.category === 'vegetable');
        console.log('[ProductService] loaded:', rows.length);
      }),
      map(() => void 0)
    );
  }

  getFruits(): Product[]     { return this.fruits; }
  getVegetables(): Product[] { return this.vegetables; }

  /** הוספה */
  addProduct(p: Product): void {
    const body: Product = {
      name: p.name,
      imageUrl: this.ensureImageUrl(p),
      price: this.parsePrice(p.price as any),
      link: p.link,
      category: p.category,
    };

    this.http.post<Product>(PRODUCTS_URL, body).subscribe({
      next: (saved) => {
        const fixed: Product = {
          ...saved,
          price: this.parsePrice(saved.price as any),
          imageUrl: this.ensureImageUrl(saved),
        };
        if (fixed.category === 'fruit') {
          this.fruits = [...this.fruits, fixed];
        } else {
          this.vegetables = [...this.vegetables, fixed];
        }
      },
      error: (e) => console.error('[ProductService] addProduct failed', e),
    });
  }

  /** עדכון לפי id */
  updateProduct(id: string, patch: Partial<Product>): void {
    const toSend: Partial<Product> = { ...patch };
    if (toSend.price != null) toSend.price = this.parsePrice(toSend.price as any);
    if (toSend.imageUrl != null) {
      toSend.imageUrl = this.ensureImageUrl({
        ...(patch as Product),
        id,
        name: patch.name ?? '',
        category: patch.category ?? 'fruit',
        price: (patch.price as any) ?? 0,
        link: patch.link ?? '',
        imageUrl: patch.imageUrl ?? ''
      });
    }

    this.http.put<Product>(`${PRODUCTS_URL}/${id}`, toSend).subscribe({
      next: (saved) => {
        const fixed: Product = {
          ...saved,
          price: this.parsePrice(saved.price as any),
          imageUrl: this.ensureImageUrl(saved),
        };

        const replaceIn = (arr: Product[]) => arr.map(x => (x.id === id ? fixed : x));
        const wasFruit = this.fruits.some(x => x.id === id);

        this.fruits = replaceIn(this.fruits);
        this.vegetables = replaceIn(this.vegetables);

        const nowFruit = fixed.category === 'fruit';
        if (wasFruit && !nowFruit) {
          this.fruits = this.fruits.filter(x => x.id !== id);
          if (this.vegetables.every(x => x.id !== id)) this.vegetables = [...this.vegetables, fixed];
        } else if (!wasFruit && nowFruit) {
          this.vegetables = this.vegetables.filter(x => x.id !== id);
          if (this.fruits.every(x => x.id !== id)) this.fruits = [...this.fruits, fixed];
        }
      },
      error: (e) => console.error('[ProductService] updateProduct failed', e),
    });
  }

  /** מחיקה לפי name+category */
  deleteProduct(name: string, category: Category): void {
    const params = new HttpParams().set('name', name).set('category', category);

    this.http.get<Product[]>(PRODUCTS_URL, { params }).subscribe({
      next: (rows) => {
        const hit = rows?.[0];
        if (!hit?.id) return;

        this.http.delete(`${PRODUCTS_URL}/${hit.id}`).subscribe({
          next: () => {
            if (category === 'fruit') {
              this.fruits = this.fruits.filter(x => x.id !== hit.id);
            } else {
              this.vegetables = this.vegetables.filter(x => x.id !== hit.id);
            }
          },
          error: (e) => console.error('[ProductService] deleteProduct: delete failed', e),
        });
      },
      error: (e) => console.error('[ProductService] deleteProduct: find failed', e),
    });
  }

  /** חיפוש לפי שם+קטגוריה */
  findByNameCategory(name: string, category: Category): Observable<Product[]> {
    const params = new HttpParams().set('name', name).set('category', category);
    return this.http.get<Product[]>(PRODUCTS_URL, { params }).pipe(
      map(rows => (rows ?? []).map(r => ({
        ...r,
        price: this.parsePrice(r.price as any),
        imageUrl: this.ensureImageUrl(r),
      })))
    );
  }
}
