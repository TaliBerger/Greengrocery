import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About {

  images = [
    'assets/images/about/store1.jpg',
    'assets/images/about/store2.jpg',
    'assets/images/about/store3.jpg',
    'assets/images/about/store4.jpg',
    'assets/images/about/store5.jpg',
    'assets/images/about/store6.jpg',
    'assets/images/about/store7.jpg',
    'assets/images/about/store8.jpg',
     'assets/images/about/store9.jpg',
      'assets/images/about/store10.jpg',
       'assets/images/about/store11.jpg',
        'assets/images/about/store12.jpg',
  ];

  @ViewChild('strip', { static: true }) strip!: ElementRef<HTMLDivElement>;

  scroll(dir: 1 | -1) {
    const el = this.strip.nativeElement;
    const card = el.querySelector<HTMLElement>('.carousel-card');
    const step = (card?.offsetWidth || 220) + 12; // רוחב כרטיס + מרווח
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  // חיצי מקלדת לגלילה אופקית
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') this.scroll(1);
    if (e.key === 'ArrowLeft')  this.scroll(-1);
  }

  onImgError(ev: Event, idx: number) {
    const img = ev.target as HTMLImageElement;
    img.onerror = null;
    img.src = `https://picsum.photos/seed/about-${idx}/600/400`;
  }
}
