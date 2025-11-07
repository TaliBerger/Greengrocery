import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './authForm.html',
  styleUrls: ['./authForm.css']
})
export class AutoForm implements OnInit, OnDestroy {


  // --- Login fields ---
  email = '';
  password = '';
  loading = false;
  error = '';

  // --- Register fields ---
  regName = '';
  regEmail = '';
  regPassword = '';
  regRole: 'user' | 'admin' = 'user';
  regLoading = false;
  regError = '';
  regOk = '';
  interval: number | undefined;

  constructor(private router: Router, public auth: AuthService) {}

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  // Login
  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email.trim(), this.password).subscribe(ok => {
      this.loading = false;
      if (!ok) {
        this.error = 'Email or password is incorrect';
        return;
      }
    });
  }

  // Register
  submitRegister() {
    this.regLoading = true;
    this.regError = '';
    this.regOk = '';
    const n = this.regName.trim(), e = this.regEmail.trim(), p = this.regPassword;
    if (!n || !e || !p) {
      this.regLoading = false;
      this.regError = 'All fields are required';
      return;
    }
    this.auth.register(n, e, p).subscribe(ok => {
      this.regLoading = false;
      if (!ok) {
        this.regError = 'Email already exists';
        return;
      }
      this.regOk = 'Account created successfully';
      this.regName = this.regEmail = this.regPassword = '';
      this.regRole = 'user';
    });
  }

  logout() {
    this.auth.logout();
    alert('You have been logged out successfully.');
  }

  ngOnInit() {

  }

}
