import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatePaymentResponse } from '../Models/create-payment-response';

@Injectable({
  providedIn: 'root',
})
export class Payment {

  private baseUrl = 'https://udemyfpiti.runasp.net/api/Payment';

  constructor(private http: HttpClient) {}

createPayment(data: any) {
  return this.http.post<CreatePaymentResponse>(
    `${this.baseUrl}/create-payment`,
    data
  );
}


  getPaymentStatus(transactionId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/status/${transactionId}`
    );
  }

  // 🔹 Callback
  paymentCallback(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/callback`
    );
  }
  
}
