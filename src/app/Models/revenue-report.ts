export interface RevenueReport {
  total: number;
  transactions: number;
  avgPerTransaction: number;
  period: string;
  transactionsList: Transaction[];
}
export interface Transaction {
  date: string;
  course: string;
  amount: number;
  status: string;
}
