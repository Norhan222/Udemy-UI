import { Component, inject, OnInit, Pipe } from '@angular/core';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';


@Component({
  selector: 'app-cart-component',
  imports: [],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css',
})
export class CartComponent implements OnInit{
  private cartService = inject(CartService);
 wishlistMap: { [courseId: number]: boolean } = {};
loadingMap: { [courseId: number]: boolean } = {};

  cartItems: any[] = []; // لتخزين عناصر الكارت
  subTotal: number = 0;
  total: number = 0;
 private wishlistService = inject(WishlistService);
 checkWishlist(courseId: number) {
  this.wishlistService.checkCourse(courseId).subscribe({
    next: (res) => {
      this.wishlistMap[courseId] = res;
    },
    error: () => {
      this.wishlistMap[courseId] = false;
    }
  });
}

  ngOnInit(): void {
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems = res.data.items;
      this.subTotal = res.data.subTotal;
      this.total = res.data.total;

      // ✅ check wishlist لكل كورس
      this.cartItems.forEach(item => {
        this.checkWishlist(item.courseId);
      });
    },
    error: (err) => {
      console.error(err);
    }
  });
}

addWishlist(courseId: number) {
  if (this.wishlistMap[courseId]) return;

  this.loadingMap[courseId] = true;

  this.wishlistService.addToWishlist(courseId).subscribe({
    next: () => {
      this.wishlistMap[courseId] = true;
      this.loadingMap[courseId] = false;

      // ✅ لو حابب يتشال من الكارت بعد النقل
      this.removeItem(courseId);
    },
    error: err => {
      this.loadingMap[courseId] = false;
      console.error("Not added", err);
    }
  });
}

  // لو حبيت تضيف remove from cart
  removeItem(courseId: number) {
    this.cartService.removeFromCart(courseId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.courseId !== courseId);
        this.subTotal = this.cartItems.reduce((acc, item) => acc + item.coursePrice, 0);
        this.total = this.subTotal;
      },
      error: (err) => console.error(err)
    });
  }
}




