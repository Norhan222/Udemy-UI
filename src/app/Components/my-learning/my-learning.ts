import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist';

@Component({
  selector: 'app-my-learning',
  imports: [],
  templateUrl: './my-learning.html',
  styleUrl: './my-learning.css',
})
export class MyLearning implements OnInit{
  private wishlistService = inject(WishlistService);
  wishlistItems: any[] = [];
ngOnInit(): void {
  this.wishlistService.getWishlist().subscribe({
    next: (res) => {
      this.wishlistItems = res.data;
      console.log("Wishlist items:", this.wishlistItems);
    },
    error: (err) => {
      console.error("Error fetching wishlist:", err);
    }
  });
}
remove(courseId: number) {
  this.wishlistService.removeFromWishlist(courseId).subscribe({
    next: (res) => {
      this.wishlistItems = this.wishlistItems.filter(item => item.courseId !== courseId);
      console.log("removed",res);
      
    },
    error: (err) => {
      console.error("Error removing from wishlist:", err);
    }
  });
}
}
