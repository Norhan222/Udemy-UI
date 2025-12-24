import { Component, inject, OnInit, Pipe } from '@angular/core';
import { CartService } from '../../Services/cart-service';
import { CurrencyPipe } from '@angular/common';

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
        this.cartItems=res.data.items;
        console.log("res",res.data.items);
        console.log("cart",this.cartItems);    
        this.subTotal = res.data.subTotal;
        this.total = res.data.total;
      },
      error: (err) => {
        console.error(err);
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




