import { PerformanceService } from './../../../../Services/performance-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../../../Models/revenue-report';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-revenue-report',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './revenue-report.html',
  styleUrl: './revenue-report.css',
})
export class RevenueReport {

  constructor(private performanceService: PerformanceService, private cdr: ChangeDetectorRef) {

  }


  timeframe: string = '30days';





  loadRevenue(): void {

    this.performanceService.getRevenueReport(this.timeframe)
      .subscribe({
        next: (res) => {
          this.revenueData = {
            total: res.total,
            transactions: res.transactions,
            avgPerTransaction: res.avgPerTransaction,
            period: res.period
          };
          this.cdr.detectChanges()


          this.filteredTransactions = res.transactionsList;
          this.cdr.detectChanges()

        },
        error: () => {
        }
      });
  }

  filteredTransactions: Transaction[] = [];
  revenueData: RevenueData = {
    total: 0,
    transactions: 0,
    avgPerTransaction: 0,
    period: '30 days'
  };

  ngOnInit(): void {
    this.loadRevenue();
    this.cdr.detectChanges()
  }


  onTimeframeChange(): void {
    this.loadRevenue();
    this.cdr.detectChanges()
  }


  getTotalAllTimeRevenue(): number {
    return this.revenueData.total
  }
}




interface RevenueData {
  total: number;
  transactions: number;
  avgPerTransaction: number;
  period: string;
}
