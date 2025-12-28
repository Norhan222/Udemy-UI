import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatePaymentResponse } from '../Models/create-payment-response';

@Injectable({
  providedIn: 'root',
})
export class Payment {

  private baseUrl = 'http://udemyfinalproject.runasp.net/api/Payment';

  constructor(private http: HttpClient) {}

  // 🔹 Create Payment
createPayment(data: any) {
  return this.http.post<CreatePaymentResponse>(
    `${this.baseUrl}/create-payment`,
    data
  );
}


  // 🔹 Get Payment Status
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
