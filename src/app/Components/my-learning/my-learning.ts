import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist';
import { CourseService } from '../../Services/course-service';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-learning',
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './my-learning.html',
  styleUrl: './my-learning.css',
})
export class MyLearning implements OnInit {
  private wishlistService = inject(WishlistService);
  private courseService = inject(CourseService);
  private cd = inject(ChangeDetectorRef);

  wishlistItems: any[] = [];
  myCourses: any[] = [];

  // Loading states
  isLoadingCourses = false;
  isLoadingWishlist = false;

  ngOnInit(): void {
    this.loadCourses();
    this.loadWishlist();
  }

  loadCourses(): void {
    this.isLoadingCourses = true;
    this.courseService.getMyCourses().subscribe({
      next: (res) => {
        this.myCourses = res.data;
        console.log("My courses:", this.myCourses);
        this.isLoadingCourses = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching my courses:", err);
        this.isLoadingCourses = false;
        this.cd.detectChanges();
      }
    });
  }

  loadWishlist(): void {
    this.isLoadingWishlist = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistItems = res.data;
        console.log("Wishlist items:", this.wishlistItems);
        this.isLoadingWishlist = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching wishlist:", err);
        this.isLoadingWishlist = false;
        this.cd.detectChanges();
      }
    });
  }

  remove(courseId: number): void {
    this.wishlistService.removeFromWishlist(courseId).subscribe({
      next: (res) => {
        this.wishlistItems = this.wishlistItems.filter(item => item.courseId !== courseId);
        console.log("removed", res);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error removing from wishlist:", err);
        this.cd.detectChanges();
      }
    });
  }
}