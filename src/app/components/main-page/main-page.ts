import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage implements OnInit, OnDestroy {
  goToForm() { throw new Error('Method not implemented.'); }

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

  // --- פרטי חנות לפוטר ---
  storeName = 'GreenMarket';
  phone = '03-5555555';
  address = 'השוק 12, תל-אביב';
  emailTo = 'hello@green.example';

  // --- ניוזלטר בפוטר ---
  emailNl = '';

  // --- שנה לפוטר (במקום (new Date()) בתבנית) ---
  year: number = new Date().getFullYear();

  constructor(private router: Router, public auth: AuthService) {}

  // Login
  submit() {
    this.loading = true; this.error = '';
    this.auth.login(this.email.trim(), this.password).subscribe(ok => {
      this.loading = false;
      if (!ok) { this.error = 'Email or password is incorrect'; return; }
    });
  }

  // Register (creates user in MockAPI, then logs in automatically)
  submitRegister() {
    this.regLoading = true; this.regError = ''; this.regOk = '';
    const n = this.regName.trim(), e = this.regEmail.trim(), p = this.regPassword;
    if (!n || !e || !p) { this.regLoading = false; this.regError = 'All fields are required'; return; }
    this.auth.register(n, e, p).subscribe(ok => {
      this.regLoading = false;
      if (!ok) { this.regError = 'Email already exists'; return; }
      this.regOk = 'Account created successfully';
      this.regName = this.regEmail = this.regPassword = '';
      this.regRole = 'user';
    });
  }

  logout() { this.auth.logout(); }

  // ----- השעון -----
  startDate: Date = new Date('2023-10-07T00:00:00');
  passedDays: number = 0;
  passedHours: number = 0;
  passedMinutes: number = 0;
  passedSeconds: number = 0;
  interval: any;

  ngOnInit() {
    this.interval = setInterval(() => { this.updateTime(); }, 1000);
  }

  updateTime() {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - this.startDate.getTime();
    this.passedDays = Math.floor(timeDifference / (1000 * 3600 * 24));
    this.passedHours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
    this.passedMinutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));
    this.passedSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  }

  ngOnDestroy() { clearInterval(this.interval); }

  // ----- פוטר: הצטרפות לרשימת תפוצה -----
  onSubscribe(ev: Event) {
    ev.preventDefault();
    if (!this.emailNl.trim()) return;
    console.log('[Newsletter] subscribe:', this.emailNl);
    this.emailNl = '';
    alert('תודה! נעדכן אותך במבצעים טריים 🥦');
  }
}
