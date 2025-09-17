import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  /** אפשר להזין מבחוץ, יש ברירות מחדל יפות */
  @Input() storeName = 'GreenMarket';
  @Input() phone = '03-5555555';
  @Input() address = 'השוק 12, תל-אביב';
  @Input() emailTo = 'hello@green.example';

  year = new Date().getFullYear();

  /** ניוזלטר */
  emailNl = '';
  onSubscribe(ev: Event) {
    ev.preventDefault();
    if (!this.emailNl.trim()) return;
    console.log('[Newsletter] subscribe:', this.emailNl);
    this.emailNl = '';
    alert('תודה! נעדכן אותך במבצעים טריים 🥦');
  }
}
