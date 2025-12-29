import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartData, PerformanceService } from '../../../../Services/performance-service';


@Component({
  selector: 'app-overview',
  imports: [CommonModule,FormsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit  {
selectedRange = 'Last 12 months';
  selectedCourse = 'All courses';
  isLoading = false;

  performanceData: PerformanceData = {
    totalRevenue: 0,
    monthRevenue: 0,
    totalEnrollments: 0,
    monthEnrollments: 0,
    averageRating: 0,
    chartData: []
  };

  metrics: PerformanceMetric[] = [];
  courses: string[] = ['All courses'];

  dateRanges = [
    'Last 7 days',
    'Last 30 days',
    'Last 12 months',
    'All time'
  ];

  // ✅ Inject الـ Service
  constructor(private performanceService: PerformanceService,private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('🚀 Overview component initialized');
    this.loadCourses();
    this.loadPerformanceData();
  }

  // ✅ استخدام الـ Service لجلب الكورسات
  loadCourses(): void {
    console.log('📚 Loading courses from API...');

    this.performanceService.getInstructorCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.cdr.detectChanges()
        console.log('✅ Courses loaded successfully:', courses);
      },
      error: (error) => {
        console.error('❌ Error loading courses:', error);
        console.warn('⚠️ Using fallback courses');
        this.courses = ['All courses', 'Course 1', 'Course 2', 'Course 3'];
      }
    });
  }

  // ✅ استخدام الـ Service لجلب بيانات الأداء
  loadPerformanceData(): void {
    console.log('📊 Loading performance data from API...');
    console.log('   Course:', this.selectedCourse);
    console.log('   Date Range:', this.selectedRange);

    this.isLoading = true;

    this.performanceService.getPerformanceData(
      this.selectedCourse,
      this.selectedRange
    ).subscribe({
      next: (data) => {
        console.log('✅ Performance data loaded successfully:', data);
        this.performanceData = data;
        this.cdr.detectChanges()
        this.updateMetrics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading performance data:', error);
        console.warn('⚠️ Using mock data for development');

        // Fallback للـ mock data
        this.performanceData = this.getMockData();
        this.updateMetrics();
        this.isLoading = false;
      }
    });
    this.cdr.detectChanges();
  }

  // ✅ Mock Data كـ fallback (للتطوير فقط)
  getMockData(): PerformanceData {
    console.log('🎭 Generating mock data...');

    const baseRevenue = Math.floor(Math.random() * 5000) + 1000;
    const baseEnrollments = Math.floor(Math.random() * 200) + 50;

    return {
      totalRevenue: baseRevenue * 10,
      monthRevenue: baseRevenue,
      totalEnrollments: baseEnrollments * 8,
      monthEnrollments: baseEnrollments,
      averageRating: parseFloat((Math.random() * 2 + 3).toFixed(2)),
      chartData: this.generateMockChartData()
    };
  }

  generateMockChartData(): ChartData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 1000) + 200,
      enrollments: Math.floor(Math.random() * 50) + 10
    }));
  }

  // ✅ تحديث الـ Metrics Cards من البيانات
  updateMetrics(): void {
    console.log('🔄 Updating metrics...');

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
    this.cdr.detectChanges();

    console.log('✅ Metrics updated:', this.metrics);
  }

  // ✅ عند تغيير الكورس
  onCourseChange(): void {
    console.log('📚 Course changed to:', this.selectedCourse);
    this.loadPerformanceData();
    this.cdr.detectChanges()
  }

  // ✅ عند تغيير الـ Date Range
  onDateRangeChange(): void {
    console.log('📅 Date range changed to:', this.selectedRange);
    this.loadPerformanceData();
  }

  // ✅ استخدام الـ Service للـ Export
  onExport(): void {
    console.log('📥 Exporting performance data...');

    const format = confirm('Export as CSV?\n\nClick OK for CSV or Cancel for JSON')
      ? 'csv'
      : 'json';

    console.log(`   Format: ${format.toUpperCase()}`);

    // ✅ استخدام الـ Service للـ export
    this.performanceService.exportData(this.performanceData, format);

    console.log('✅ Data exported successfully!');
    alert(`Data exported successfully as ${format.toUpperCase()}!`);
  }

  // ✅ Check if there's data to display
  hasData(): boolean {
    const result = this.performanceData.totalRevenue > 0 ||
                   this.performanceData.totalEnrollments > 0;
    return result;
  }

  // ✅ حساب ارتفاع الـ bar بشكل ديناميكي
  getBarHeight(revenue: number): number {
    if (!this.performanceData.chartData ||
        this.performanceData.chartData.length === 0) {
      return 0;
    }

    const maxRevenue = Math.max(
      ...this.performanceData.chartData.map(d => d.revenue)
    );

    if (maxRevenue === 0) return 0;

    const percentage = (revenue / maxRevenue) * 100;
    return Math.max(percentage, 20); // على الأقل 20%
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
