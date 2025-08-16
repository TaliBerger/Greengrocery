import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ייבוא RouterModule

@Component({
  selector: 'app-first-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './first-navbar.html',
  styleUrl: './first-navbar.css'
})
export class FirstNavbar {

}
