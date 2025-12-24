import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
  selectedRange = 'Last 12 months';
selectedCourse = 'All courses';
  selectedDateRange = 'Last 12 months';
  
  metrics: PerformanceMetric[] = [
    {
      label: 'This month so far',
      value: '$0.00',
      subtitle: '$0.00 total revenue',
      hasInfo: false
    },
    {
      label: 'This month so far',
      value: '0',
      subtitle: '0 total enrollments',
      hasInfo: true
    },
    {
      label: 'This month so far',
      value: '0',
      subtitle: '0.00 average rating',
      hasInfo: true
    }
  ];

  sidebarItems = [
    { label: 'Overview', active: true },
    { label: 'Revenue', active: false },
    { label: 'Students', active: false },
    { label: 'Reviews', active: false },
    { label: 'Engagement', active: false, hasSubmenu: true },
    { label: 'Traffic & conversion', active: false }
  ];

  onCourseChange(course: string) {
    this.selectedCourse = course;
  }

  onDateRangeChange(range: string) {
    this.selectedDateRange = range;
  }

  onExport() {
    console.log('Exporting data...');
  }

  onNavigate(item: string) {
    console.log('Navigating to:', item);
  }
}
interface PerformanceMetric {
  label: string;
  value: string | number;
  subtitle: string;
  hasInfo: boolean;
}
