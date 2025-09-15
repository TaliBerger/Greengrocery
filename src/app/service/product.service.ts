// src/app/service/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';

// כתובת ה-API שלך ב-MockAPI (עדכני אם צריך)
const BASE = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private fruits: Product[] = [];
  private vegetables: Product[] = [];

  constructor(private http: HttpClient) {}

  private parsePrice(p: string | number): number {
    if (typeof p === 'number') return p;
    return parseFloat((p || '').replace(/[^0-9.]/g, '')) || 0;
  }

  /**
   * תמונה תואמת לשם המוצר:
   * אם ה-URL קיים והוא http(s) – נשמור עליו.
   * אחרת – נשתמש ב-Unsplash Source לפי שם+קטגוריה (למשל: apple,fruit).
   */
// URL רלוונטי לפי שם+קטגוריה, יציב עם seed וללא CORB/Redirects
  private ensureImageUrl(p: Product): string {
    const url = (p.imageUrl ?? '').trim();
    const isHttp = /^https?:\/\//i.test(url);
    if (isHttp && url) return url;

    const seed = encodeURIComponent(`${p.category}-${p.name}`.toLowerCase());
    const tag1 = encodeURIComponent((p.category || '').toLowerCase()); // fruit/vegetable
    const tag2 = encodeURIComponent((p.name || '').toLowerCase());     // apple/tomato...

    // loremflickr עם seed ותגיות מתאימות לשם
    return `https://loremflickr.com/seed/${seed}/600/450/${tag1},${tag2}`;
  }


  /** טעינה מה-API: מביאים הכל ומסננים מקומית לקטגוריות */
  load(urlBase: string = BASE): Observable<void> {
    return this.http.get<Product[]>(`${urlBase}/products`).pipe(
      map((rows: Product[]) =>
        (rows ?? []).map((r: Product) => ({
          ...r,
          price: this.parsePrice(r.price as any),
          imageUrl: this.ensureImageUrl(r),
        }))
      ),
      tap((rows: Product[]) => {
        this.fruits     = rows.filter(r => r.category === 'fruit');
        this.vegetables = rows.filter(r => r.category === 'vegetable');
        console.log('Loaded rows:', rows.length);
        console.log('Fruits:', this.fruits.length, 'Vegetables:', this.vegetables.length);
      }),
      map(() => void 0)
    );
  }

  getFruits(): Product[]     { return this.fruits; }
  getVegetables(): Product[] { return this.vegetables; }

  /** הוספה: POST + עדכון מטמון, כולל יצירת imageUrl רלוונטי אם חסר */
  addProduct(p: Product): void {
    const body: Product = {
      name: p.name,
      imageUrl: this.ensureImageUrl(p),
      price: this.parsePrice(p.price as any),
      link: p.link,
      category: p.category,
    };

    this.http.post<Product>(`${BASE}/products`, body).subscribe({
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
      error: (e) => console.error('addProduct failed', e),
    });
  }

  /** מחיקה: מאתרים לפי name+category לקבלת id ואז DELETE */
  deleteProduct(name: string, category: Category): void {
    const params = new HttpParams().set('name', name).set('category', category);
    this.http.get<Product[]>(`${BASE}/products`, { params }).subscribe({
      next: (rows) => {
        const hit = rows?.[0];
        if (!hit?.id) return;
        this.http.delete(`${BASE}/products/${hit.id}`).subscribe({
          next: () => {
            if (category === 'fruit')
              this.fruits = this.fruits.filter(x => x.id !== hit.id);
            else
              this.vegetables = this.vegetables.filter(x => x.id !== hit.id);
          },
          error: (e) => console.error('deleteProduct: delete failed', e),
        });
      },
      error: (e) => console.error('deleteProduct: find failed', e),
    });
  }
}
