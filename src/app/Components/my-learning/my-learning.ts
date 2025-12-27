import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist';
import { CourseService } from '../../Services/course-service';

@Component({
  selector: 'app-my-learning',
  imports: [],
  templateUrl: './my-learning.html',
  styleUrl: './my-learning.css',
})
export class MyLearning implements OnInit{
  private wishlistService = inject(WishlistService);
  private courseService = inject(CourseService);
  wishlistItems: any[] = [];
  myCourses: any[] = [];
  private cd = inject(ChangeDetectorRef);
ngOnInit(): void {
  this.wishlistService.getWishlist().subscribe({
    
    next: (res) => {
      this.wishlistItems = res.data;
      console.log("Wishlist items:", this.wishlistItems);
      this.cd.detectChanges();

    },
    error: (err) => {
      console.error("Error fetching wishlist:", err);
      this.cd.detectChanges();
    }
  });
  this.courseService.getMyCourses().subscribe({
  next: (res) => {
    this.myCourses = res.data;
    
    console.log("My courses:", this.myCourses);
    this.cd.detectChanges();
  },
  error: (err) => {
    console.error("Error fetching my courses:", err);
    this.cd.detectChanges();
  }
});
}
remove(courseId: number) {
  this.wishlistService.removeFromWishlist(courseId).subscribe({
    next: (res) => {
      this.wishlistItems = this.wishlistItems.filter(item => item.courseId !== courseId);
      console.log("removed",res);
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error("Error removing from wishlist:", err);
      this.cd.detectChanges();
    }
  });
}

}
