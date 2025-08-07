import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { FirstNavbarComponent } from '../first-navbar/first-navbar.component'; 
import { VegetablesGridComponent } from '../vegetables-grid/vegetables-grid.component';
import { FruitsGridComponent } from '../fruits-grid/fruits-grid.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FirstNavbarComponent, VegetablesGridComponent, FruitsGridComponent, RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  startDate: Date = new Date('2023-10-07T00:00:00');
  passedDays: number = 0;
  passedHours: number = 0;
  passedMinutes: number = 0;
  passedSeconds: number = 0;
  interval: any;

  //constructor(private router: Router) {} 

  ngOnInit() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - this.startDate.getTime();

    this.passedDays = Math.floor(timeDifference / (1000 * 3600 * 24));
    this.passedHours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
    this.passedMinutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));
    this.passedSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

//  goToForm(): void {
//    this.router.navigate(['/form']); 
//  }

}
