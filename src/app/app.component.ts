import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  images: string[] = [
    '/assets/images/nanda_2.jpeg',
    '/assets/images/nanda_1.jpeg',
    '/assets/images/nanda_4.jpeg',
    '/assets/images/nanda_3.jpeg',
    '/assets/images/nanda_5.jpeg',
  ];

  currentIndex = 0;

  private touchStartX = 0;
  private touchEndX = 0;

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goTo(i: number) {
    this.currentIndex = i;
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0]?.clientX ?? 0;
  }

  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0]?.clientX ?? 0;
    const delta = this.touchStartX - this.touchEndX;

    if (Math.abs(delta) < 35) return;

    if (delta > 0) this.next();
    else this.prev();
  }
}
