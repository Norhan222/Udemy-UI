import { PaymentCourse } from "./payment-course";

export interface CreatePaymentResponse {
     paymentIds: number[];
  transactionIds: string[];
  courses: PaymentCourse[];
  totalAmount: number;
  totalPlatformFee: number;
  totalTax: number;
  totalInstructorAmount: number;
  redirectUrl: string;
}
