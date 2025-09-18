import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { AuthService } from '../../service/auth.service';
import { Category, Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
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
    // חגורת בטיחות: רק אדמין נכנס
    if (!this.auth.isAdmin) {
      alert(this.auth.isLoggedIn ? 'Access denied' : 'Please log in to place an order');
      this.router.navigateByUrl('/');
      return;
    }

    this.productForm = this.fb.group({
      action: ['add', Validators.required], // 'add' | 'delete'
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null]                         // יהפוך לחובה רק ב-'add'
    });

    // price חובה רק בהוספה
    this.productForm.get('action')!.valueChanges.subscribe((action: 'add' | 'delete') => {
      const priceCtrl = this.productForm.get('price')!;
      if (action === 'add') {
        priceCtrl.addValidators([Validators.required, Validators.min(0.01)]);
      } else {
        priceCtrl.clearValidators();
      }
      priceCtrl.updateValueAndValidity();
    });
  }

  isAddAction(): boolean {
    return this.productForm.get('action')?.value === 'add';
  }

  onSubmit(): void {
    const action   = (this.productForm.get('action')!.value ?? 'add') as 'add' | 'delete';
    const name     = ((this.productForm.get('name')!.value as string) || '').trim();
    const category = this.productForm.get('category')!.value as Category;

    if (action === 'add') {
      if (this.productForm.invalid) {
        alert('Please fill all fields correctly');
        return;
      }

      const payload: Omit<Product, 'id'> = {
        name,
        category,
        price: +this.productForm.get('price')!.value,
        link: this.buildHebrewWikiLink(name),
        emoji: this.autoEmoji(name, category)
      };

      this.productService.addProduct(payload).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/']);
        },
        error: (e) => alert('Failed to add product: ' + (e?.message || 'Unknown error'))
      });

    } else { // delete
      if (!name || !category) {
        alert('Please provide name and category to delete');
        return;
      }
      this.productService.deleteByNameCategory(name, category).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.router.navigate(['/']);
        },
        error: (e) => alert('Failed to delete product: ' + (e?.message || 'Product not found'))
      });
    }
  }

  /** קישור ויקיפדיה בעברית מתוך השם */
  private buildHebrewWikiLink(name: string): string {
    const clean = (name || '').trim().replace(/\s+/g, ' ');
    return clean ? `https://he.wikipedia.org/wiki/${encodeURIComponent(clean)}` : '';
  }

  /** אימוג'י אוטומטי לפי שם/קטגוריה (עברית/אנגלית) */
  private autoEmoji(name: string, category: Category): string {
    const n = (name || '').toLowerCase();
    const inName = (...arr: string[]) => arr.some(s => n.includes(s));

    if (category === 'fruit') {
      if (inName('banana','בננה')) return '🍌';
      if (inName('apple','תפוח'))  return '🍎';
      if (inName('orange','תפוז')) return '🍊';
      if (inName('lemon','לימון')) return '🍋';
      if (inName('peach','אפרסק')) return '🍑';
      if (inName('grape','ענב','ענבים')) return '🍇';
      if (inName('strawberry','תות')) return '🍓';
      if (inName('watermelon','אבטיח')) return '🍉';
      if (inName('melon','מלון')) return '🍈';
      if (inName('mango','מנגו')) return '🥭';
      return '🍎';
    } else {
      if (inName('cucumber','מלפפון')) return '🥒';
      if (inName('tomato','עגבניה','עגבנייה')) return '🍅';
      if (inName('carrot','גזר')) return '🥕';
      if (inName('onion','בצל')) return '🧅';
      if (inName('garlic','שום')) return '🧄';
      if (inName('corn','תירס')) return '🌽';
      if (inName('lettuce','חסה')) return '🥬';
      if (inName('pepper','פלפל')) return '🌶️';
      if (inName('broccoli','ברוקולי','כרובית')) return '🥦';
      return '🥦';
    }
  }
}
