import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule,FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {


  activeTab: 'reviews' | 'insights' = 'reviews';
  selectedCourse: string = 'all';

  filters = {
    notAnswered: true,
    hasComment: false,
    rating: 'all',
    sortBy: 'newest'
  };

  reviews: Review[] = [];
  filteredReviews: Review[] = [];

  courses = [
    { id: 'all', name: 'All courses' },
    { id: 'course1', name: 'Course 1' },
    { id: 'course2', name: 'Course 2' }
  ];

  ratingOptions = [
    { value: 'all', label: 'All' },
    { value: '5', label: '5 stars' },
    { value: '4', label: '4 stars' },
    { value: '3', label: '3 stars' },
    { value: '2', label: '2 stars' },
    { value: '1', label: '1 star' }
  ];

  sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'highest', label: 'Highest rating' },
    { value: 'lowest', label: 'Lowest rating' }
  ];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // هنا يمكنك جلب البيانات من API
    this.reviews = [
      // يمكن إضافة بيانات تجريبية هنا
    ];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReviews = this.reviews.filter(review => {
      if (this.filters.notAnswered && review.isAnswered) return false;
      if (this.filters.hasComment && !review.comment) return false;
      if (this.filters.rating !== 'all' && review.rating.toString() !== this.filters.rating) return false;
      return true;
    });

    this.sortReviews();
  }

  sortReviews(): void {
    switch (this.filters.sortBy) {
      case 'newest':
        this.filteredReviews.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        this.filteredReviews.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'highest':
        this.filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        this.filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  exportToCSV(): void {
    // منطق تصدير البيانات إلى CSV
    console.log('Exporting to CSV...');
  }

  switchTab(tab: 'reviews' | 'insights'): void {
    this.activeTab = tab;
  }
}
interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment?: string;
  date: Date;
  isAnswered: boolean;
}
