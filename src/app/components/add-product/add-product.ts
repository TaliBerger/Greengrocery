import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../service/product.service';
import { AuthService } from '../../service/auth.service';

type Category = 'fruit' | 'vegetable';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'] // שימי לב: styleUrls (לא styleUrl)
})
export class AddProduct implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    // חסימה כפולה בתוך הקומפוננטה, בנוסף ל-guards בראוטר
    if (!this.auth.isAdmin) {
      alert(this.auth.isLoggedIn ? 'Access denied' : 'Please log in to place an order');
      this.router.navigateByUrl('/');
      return;
    }

    this.productForm = this.fb.group({
      action: ['add', Validators.required],     // 'add' | 'delete'
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null],                             // יהפוך לחובה רק ב-'add'
      link: ['']                                 // ייחשב אוטומטית מה-name
    });

    // שדות חובה רק כשמוסיפים
    this.productForm.get('action')!.valueChanges.subscribe(action => {
      const priceCtrl = this.productForm.get('price')!;
      const linkCtrl  = this.productForm.get('link')!;

      if (action === 'add') {
        priceCtrl.addValidators([Validators.required, Validators.min(0.01)]);
        linkCtrl.addValidators([Validators.required]);
      } else {
        priceCtrl.clearValidators();
        linkCtrl.clearValidators();
      }
      priceCtrl.updateValueAndValidity();
      linkCtrl.updateValueAndValidity();
    });

    // בנה קישור ויקיפדיה אוטומטי כאשר name משתנה
    this.productForm.get('name')!.valueChanges.subscribe((name: string) => {
      const link = this.buildHebrewWikiLink(name);
      this.productForm.get('link')!.setValue(link, { emitEvent: false });
    });
  }

  isAddAction(): boolean {
    return this.productForm.get('action')?.value === 'add';
  }

  onSubmit(): void {
    const action   = this.productForm.get('action')?.value as 'add' | 'delete';
    const name     = (this.productForm.get('name')?.value as string || '').trim();
    const category = this.productForm.get('category')?.value as Category;

    if (action === 'add') {
      if (this.productForm.invalid) {
        alert('Please fill all fields correctly');
        return;
      }

      const payload = {
        name,
        category,
        price: +this.productForm.get('price')!.value,
        link: this.productForm.get('link')!.value
      };

      const maybe$ = this.productService.addProduct(payload) as any;
      if (maybe$?.subscribe) {
        maybe$.subscribe({
          next: () => {
            alert('Product added successfully');
            this.router.navigate(['/']);
          },
          error: (e: any) => alert('Failed to add product: ' + (e?.message || 'Unknown error'))
        });
      } else {
        // במקרה והשירות שלך לא מחזיר Observable (לוגיקה מקומית)
        alert('Product added successfully');
        this.router.navigate(['/']);
      }

    } else { // delete
      if (!name || !category) {
        alert('Please provide name and category to delete');
        return;
      }

      const maybe$ = this.productService.deleteProduct(name, category) as any;
      if (maybe$?.subscribe) {
        maybe$.subscribe({
          next: () => {
            alert('Product deleted successfully');
            this.router.navigate(['/']);
          },
          error: (e: any) => alert('Failed to delete product: ' + (e?.message || 'Product not found'))
        });
      } else {
        // במקרה והשירות שלך לא מחזיר Observable (לוגיקה מקומית)
        alert('Product deleted successfully');
        this.router.navigate(['/']);
      }
    }
  }

  /** קישור ויקיפדיה בעברית מתוך השם */
  private buildHebrewWikiLink(name: string): string {
    const clean = (name || '').trim().replace(/\s+/g, ' ');
    return clean ? `https://he.wikipedia.org/wiki/${encodeURIComponent(clean)}` : '';
    // אם תרצי באנגלית: החליפי ל-https://en.wikipedia.org/wiki/...
  }
}
