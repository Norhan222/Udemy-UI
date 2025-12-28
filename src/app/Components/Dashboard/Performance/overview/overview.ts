import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-overview',
  imports: [CommonModule,FormsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
 selectedRange = 'Last 12 months';
  selectedCourse = 'All courses';
  isLoading = false;
  
  // ✅ Performance Data
  performanceData: PerformanceData = {
    totalRevenue: 0,
    monthRevenue: 0,
    totalEnrollments: 0,
    monthEnrollments: 0,
    averageRating: 0,
    chartData: []
  };
  
  // ✅ Metrics التي ستظهر في الكروت
  metrics: PerformanceMetric[] = [];

  // ✅ Options للـ dropdowns
  courses = ['All courses', 'Course 1', 'Course 2', 'Course 3'];
  dateRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'Last 12 months', 'This year', 'All time'];

  ngOnInit(): void {
    // ✅ حمّل البيانات فوراً بدون setTimeout
    this.loadPerformanceData();
  }

  // ✅ تحميل البيانات (من API أو Mock Data)
  loadPerformanceData(): void {
    this.isLoading = true;

    // ✅ استخدم setTimeout أقصر أو احذفه تماماً
    try {
      this.performanceData = this.getMockData();
      this.updateMetrics();
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading data:', error);
      this.isLoading = false;
    }
  }

  // ✅ Mock Data Generator
  getMockData(): PerformanceData {
    // ✅ بيانات عشوائية بناءً على الفلاتر
    const baseRevenue = this.getBaseRevenue();
    const baseEnrollments = this.getBaseEnrollments();
    
    return {
      totalRevenue: baseRevenue * 10,
      monthRevenue: baseRevenue,
      totalEnrollments: baseEnrollments * 8,
      monthEnrollments: baseEnrollments,
      averageRating: this.getRandomRating(),
      chartData: this.generateChartData()
    };
  }

  // ✅ حساب الـ Revenue بناءً على الكورس المختار
  getBaseRevenue(): number {
    if (this.selectedCourse === 'All courses') {
      return Math.floor(Math.random() * 5000) + 1000; // 1000-6000
    } else if (this.selectedCourse === 'Course 1') {
      return Math.floor(Math.random() * 2000) + 500; // 500-2500
    } else if (this.selectedCourse === 'Course 2') {
      return Math.floor(Math.random() * 3000) + 800; // 800-3800
    } else {
      return Math.floor(Math.random() * 1500) + 300; // 300-1800
    }
  }

  // ✅ حساب الـ Enrollments
  getBaseEnrollments(): number {
    if (this.selectedCourse === 'All courses') {
      return Math.floor(Math.random() * 200) + 50; // 50-250
    } else {
      return Math.floor(Math.random() * 80) + 20; // 20-100
    }
  }

  // ✅ Random Rating
  getRandomRating(): number {
    return parseFloat((Math.random() * 2 + 3).toFixed(2)); // 3.00-5.00
  }

  // ✅ Generate Chart Data
  generateChartData(): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 1000) + 200,
      enrollments: Math.floor(Math.random() * 50) + 10
    }));
  }

  // ✅ تحديث الـ Metrics Cards
  updateMetrics(): void {
    this.metrics = [
      {
        label: 'This month so far',
        value: `$${this.performanceData.monthRevenue.toFixed(2)}`,
        subtitle: `$${this.performanceData.totalRevenue.toFixed(2)} total revenue`,
        hasInfo: false
      },
      {
        label: 'This month so far',
        value: this.performanceData.monthEnrollments,
        subtitle: `${this.performanceData.totalEnrollments} total enrollments`,
        hasInfo: true
      },
      {
        label: 'This month so far',
        value: this.performanceData.averageRating.toFixed(2),
        subtitle: `${this.performanceData.averageRating.toFixed(2)} average rating`,
        hasInfo: true
      }
    ];
  }

  // ✅ عند تغيير الكورس
  onCourseChange(): void {
    console.log('Course changed to:', this.selectedCourse);
    this.loadPerformanceData();
  }

  // ✅ عند تغيير الـ Date Range
  onDateRangeChange(): void {
    console.log('Date range changed to:', this.selectedRange);
    this.loadPerformanceData();
  }

  // ✅ Export Data
  onExport(): void {
    console.log('Exporting data...', {
      course: this.selectedCourse,
      range: this.selectedRange,
      data: this.performanceData
    });

    // ✅ هنا ممكن تعمل export لـ CSV أو PDF
    const dataStr = JSON.stringify(this.performanceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
  }

  // ✅ Check if there's data to display
  hasData(): boolean {
    return this.performanceData.totalRevenue > 0 || 
           this.performanceData.totalEnrollments > 0;
  }

  // ✅ حساب ارتفاع الـ bar بشكل ديناميكي
  getBarHeight(revenue: number): number {
    if (!this.performanceData.chartData || this.performanceData.chartData.length === 0) {
      return 0;
    }

    // احسب أعلى قيمة في الـ chart
    const maxRevenue = Math.max(...this.performanceData.chartData.map(d => d.revenue));
    
    // احسب النسبة المئوية (مع حد أدنى 20%)
    const percentage = (revenue / maxRevenue) * 100;
    return Math.max(percentage, 20); // على الأقل 20% عشان يبقى ظاهر
  }
}
interface PerformanceMetric {
  label: string;
  value: string | number;
  subtitle: string;
  hasInfo: boolean;
}

interface PerformanceData {
  totalRevenue: number;
  monthRevenue: number;
  totalEnrollments: number;
  monthEnrollments: number;
  averageRating: number;
  chartData?: any[];
}
