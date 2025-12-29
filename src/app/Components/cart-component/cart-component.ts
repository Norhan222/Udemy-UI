import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';
import { Payment } from '../../Services/payment';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';




@Component({
  selector: 'app-cart-component',
  templateUrl: './cart-component.html',
  imports: [],
  styleUrls: ['./cart-component.css'],
})
export class CartComponent implements OnInit ,OnDestroy{

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
        console.log("cart",this.cartItems);
        
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

  payNow() {
    if (!this.cartItems.length) {
      alert('Cart is empty');
      return;
    }

    const courseIds = this.cartItems.map(item => item.courseId).filter(id => id && id > 0);
    if (!courseIds.length) {
      alert('No valid courses to pay for');
      return;
    }

    const data = { courseIds, paymentMethod: 'card' };
    console.log('Payment Request:', data);

    this.paymentService.createPayment(data).subscribe({
      next: (res) => {
        console.log('Payment Response:', res);

        // فتح Popup
        const popupWidth = 600;
        const popupHeight = 700;
        const left = (window.screen.width / 2) - (popupWidth / 2);
        const top = (window.screen.height / 2) - (popupHeight / 2);

        window.open(
          res.redirectUrl,
          'PaymentPopup',
          `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
        );

        // تفعيل Spinner
        this.loading = true;
        this.cd.detectChanges();

        // Polling لحالة الدفع كل ثانيتين
    this.createPymentSub=    interval(3000).pipe(
          switchMap(() =>  this.paymentService.getPaymentStatus(res.transactionIds[0])),
          takeWhile(statusRes => statusRes.status === 'Pending', true)
        ).subscribe({
          next: (statusRes) => {
            console.log('Payment Status:', statusRes);

            if (statusRes.status === 'Success') {
              this.cartService.clearCart().subscribe(() => {
                this.cartItems = [];
                this.subTotal = 0;
                this.total = 0;
                this.loading = false;
                this.cd.detectChanges();
                alert("Payment successful! Cart cleared.");
                this.createPymentSub.unsubscribe();
              });
            } else if (statusRes.status !== 'Pending') {
              this.loading = false;
              this.cd.detectChanges();
              alert(`Payment status: ${statusRes.status}`);
            }
          },
          error: (err) => {
            this.loading = false;
            this.cd.detectChanges();
            alert('Error fetching payment status during polling');
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error('Payment Error:', err);
        alert('Error creating payment');
      }
    });
  }


    ngOnDestroy(): void {
    this.createPymentSub.unsubscribe();
  }
}
