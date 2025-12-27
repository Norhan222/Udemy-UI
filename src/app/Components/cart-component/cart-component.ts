import { ChangeDetectorRef, Component, inject, OnInit, Pipe } from '@angular/core';
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
  cartItems: any[] = []; // لتخزين عناصر الكارت
  subTotal: number = 0;
  total: number = 0;
 private wishlistService = inject(WishlistService);
private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems = res.data.items;
      this.subTotal = res.data.subTotal;
      this.total = res.data.total;

      // ✅ check wishlist لكل كورس
      this.cartItems.forEach(item => {
        // this.checkWishlist(item.courseId);
      });
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error(err);

    }
  });
}

addWishlist(courseId: number) {

 
  this.wishlistService.addToWishlist(courseId).subscribe({
    next: () => {
     console.log("added wish");
      // ✅ لو حابب يتشال من الكارت بعد النقل
      this.removeItem(courseId);
      this.cd.detectChanges();
    },
    error: err => {
      // this.loadingMap[courseId] = false;
      console.error("Not added", err);
      this.cd.detectChanges();
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
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}




