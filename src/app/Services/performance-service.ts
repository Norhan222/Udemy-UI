// performance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course } from '../Models/course';
import { RevenueReport } from '../Models/revenue-report';

export interface PerformanceData {
  totalRevenue: number;
  monthRevenue: number;
  totalEnrollments: number;
  monthEnrollments: number;
  averageRating: number;
  chartData?: ChartData[];
}

export interface ChartData {
  month: string;
  revenue: number;
  enrollments: number;
}

export interface ApiPerformanceResponse {
  totalRevenue: number;
  monthlyRevenue: number;
  totalEnrollments: number;
  monthlyEnrollments: number;
  averageRating: number;
  monthlyData: {
    month: string;
    revenue: number;
    enrollments: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private apiUrl =environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ جلب بيانات الأداء
  getPerformanceData(
    courseId?: string,
    dateRange?: string
  ): Observable<PerformanceData> {
    let params = new HttpParams();

    if (courseId && courseId !== 'All courses') {
      params = params.set('courseId', courseId);
    }

    if (dateRange) {
      params = params.set('dateRange', this.mapDateRange(dateRange));
    }

    return this.http.get<ApiPerformanceResponse>(
      `${this.apiUrl}/performance`,
      { params }
    ).pipe(
      map(response => this.mapResponseToPerformanceData(response))
    );
  }

  // ✅ جلب قائمة الكورسات
  getInstructorCourses(): Observable<string[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/Course/InstructorCourses`).pipe(
      map(courses => ['All courses', ...courses.map(c => c.title)])
    );
  }

  // ✅ تحويل الـ date range
  private mapDateRange(range: string): string {
    const rangeMap: { [key: string]: string } = {
      'Last 7 days': '7days',
      'Last 30 days': '30days',
      'Last 12 months': '12months',
      'All time': 'all'
    };
    return rangeMap[range] || '12months';
  }

  // ✅ تحويل الـ response من الـ API لـ format الـ component
  private mapResponseToPerformanceData(
    response: ApiPerformanceResponse
  ): PerformanceData {
    return {
      totalRevenue: response.totalRevenue,
      monthRevenue: response.monthlyRevenue,
      totalEnrollments: response.totalEnrollments,
      monthEnrollments: response.monthlyEnrollments,
      averageRating: response.averageRating,
      chartData: response.monthlyData.map(data => ({
        month: this.formatMonth(data.month),
        revenue: data.revenue,
        enrollments: data.enrollments
      }))
    };
  }

  // ✅ تنسيق اسم الشهر
  private formatMonth(month: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // لو الشهر جاي كـ number (1-12)
    const monthNum = parseInt(month);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return months[monthNum - 1];
    }

    // لو الشهر جاي كـ date string
    const date = new Date(month);
    if (!isNaN(date.getTime())) {
      return months[date.getMonth()];
    }

    return month;
  }

  // ✅ Export البيانات
  exportData(data: PerformanceData, format: 'json' | 'csv' = 'json'): void {
    if (format === 'json') {
      this.exportAsJson(data);
    } else {
      this.exportAsCsv(data);
    }
  }

  private exportAsJson(data: PerformanceData): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    this.downloadFile(dataBlob, `performance-${Date.now()}.json`);
  }

  private exportAsCsv(data: PerformanceData): void {
    let csv = 'Month,Revenue,Enrollments\n';

    data.chartData?.forEach(row => {
      csv += `${row.month},${row.revenue},${row.enrollments}\n`;
    });

    const dataBlob = new Blob([csv], { type: 'text/csv' });
    this.downloadFile(dataBlob, `performance-${Date.now()}.csv`);
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }



  getRevenueReport(timeframe: string): Observable<RevenueReport> {
    return this.http.get<RevenueReport>(
      `${this.apiUrl}/Performance/revenue-report?timeframe=${timeframe}`
    );
  }
}
