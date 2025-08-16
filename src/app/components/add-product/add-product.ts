import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule,],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      action: ['add'], 
      name: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      link: ['', Validators.required],
    });
  }

  isAddAction(): boolean {
    return this.productForm.get('action')?.value === 'add';
  }

  onSubmit(): void {
    const action = this.productForm.get('action')?.value;
    const name = this.productForm.get('name')?.value;
    const category = this.productForm.get('category')?.value;

    if (action === 'add' && this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService.addProduct(productData);
      alert('Product added successfully');
      this.router.navigate(['/']); // חזרה לדף הראשי לאחר שליחת הטופס
    } else if (action === 'delete' && name && category) {
      this.productService.deleteProduct(name, category);
      alert('Product deleted successfully');
      this.router.navigate(['/']); // חזרה לדף הראשי לאחר שליחת הטופס
    } else {
      alert('Please fill all fields correctly');
    }
  }
}