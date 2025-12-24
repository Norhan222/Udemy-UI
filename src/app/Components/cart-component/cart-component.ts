import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart-service';

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

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.data.items;
        
        this.subTotal = res.data.subTotal;
        this.total = res.data.total;
      },
      error: (err) => {
        console.error(err);
      }
    });
    // console.log("cart",this.cartItems);
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




