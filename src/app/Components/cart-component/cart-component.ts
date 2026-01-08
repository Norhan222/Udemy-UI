import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';
import { Payment } from '../../Services/payment';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-cart-component',
  templateUrl: './cart-component.html',
  imports: [TranslateModule, CommonModule, FormsModule],
  styleUrls: ['./cart-component.css'],
})
export class CartComponent implements OnInit, OnDestroy {

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private paymentService = inject(Payment);
  private cd = inject(ChangeDetectorRef);

  cartItems: any[] = [];
  subTotal: number = 0;
  total: number = 0;
  loading: boolean = false; // Spinner
  private createPymentSub!: Subscription;
  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.data.items;
        this.subTotal = res.data.subTotal;
        this.total = res.data.total;
        this.cd.detectChanges();
        console.log("cart", this.cartItems);

      },
      error: (err) => console.error(err),
    });
  }

  removeItem(courseId: number) {
    this.cartService.removeFromCart(courseId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.courseId !== courseId);
        this.subTotal = this.cartItems.reduce((acc, item) => acc + item.coursePrice, 0);
        this.total = this.subTotal;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  addWishlist(courseId: number) {
    this.wishlistService.addToWishlist(courseId).subscribe({
      next: () => {
        console.log("added wish");
        this.removeItem(courseId);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Not added", err);
        this.cd.detectChanges();
      }
    });
  }


  paymentMethod: 'card' | 'wallet' | '' = '';
  paymentMethodError: string = '';


  payNow() {
    if (!this.cartItems.length) {
      alert('Cart is empty');
      return;
    }

    if (!this.paymentMethod) {
      this.paymentMethodError = 'Please select a payment method';
      return;
    }

    this.paymentMethodError = '';

    const courseIds = this.cartItems
      .map(item => item.courseId)
      .filter(id => id && id > 0);

    if (!courseIds.length) {
      alert('No valid courses to pay for');
      return;
    }

    const totalToPay = this.discountAmount > 0 ? this.total : this.subTotal;

    const data = {
      courseIds,
      paymentMethod: this.paymentMethod, // 'card' أو 'wallet'
      totalAmount: totalToPay,
      couponId: this.couponId // Send couponId if available
    };

    this.loading = true;
    this.cd.detectChanges();

    this.createPymentSub = this.paymentService.createPayment(data).subscribe({
      next: (res) => {
        console.log('Payment Response:', res);

        // كل طرق الدفع → Redirect
        if (res.redirectUrl) {
          window.open(res.redirectUrl, '_blank');
        } else {
          alert('No redirect URL provided');
        }

        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Payment Error:', err);
        this.loading = false;
        this.cd.detectChanges();
        alert('Error creating payment');
      }
    });
  }



  couponCode: string = '';
  couponLoading: boolean = false;
  couponError: string = '';
  discountAmount: number = 0;
  couponId: number | null = null;

  applyCoupon() {
    if (!this.couponCode) {
      this.couponError = 'Please enter a coupon code';
      return;
    }

    this.couponLoading = true;
    this.couponError = '';

    // نفترض إنك هتعمل API جديد على السيرفر: /api/cart/apply-coupon
    this.cartService.applyCoupon(this.couponCode).subscribe({
      next: (res: any) => {
        console.log("coupon", res);

        if (res.appliedCouponCode) {
          this.discountAmount = res.discountAmount;
          this.total = res.totalAfterDiscount;
          this.couponId = res.couponId; // Store the coupon ID
          this.couponError = '';
        } else {
          this.couponError = res.message || 'Invalid coupon';
          this.discountAmount = 0;
          this.total = this.subTotal;
          this.couponId = null;
        }

        this.couponLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("coupon error", err);
        this.couponError = 'Error applying coupon';
        this.couponLoading = false;
        this.discountAmount = 0;
        this.total = this.subTotal;
        this.cd.detectChanges();
      }
    });
  }


  ngOnDestroy(): void {
    if (this.createPymentSub) {
      this.createPymentSub.unsubscribe();
    }
  }
}
