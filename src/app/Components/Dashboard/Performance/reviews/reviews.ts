import { ReviewService } from './../../../../Services/review-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../../Models/review';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule,FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements  OnInit {

  reviews: Review[] = [
    // { id: 1, studentName: 'أحمد محمد', courseTitle: 'Web Development', rating: 2, comment: 'المحتوى جيد لكن يحتاج تحسين', answered: false, createdDate: '2025-01-15' },
    // { id: 2, studentName: 'فاطمة علي', courseTitle: 'Data Science', rating: 5, comment: 'دورة ممتازة جداً! استفدت كثيراً', answered: true, createdDate: '2025-01-14' },
    // { id: 3, studentName: 'محمود حسن', courseTitle: 'Web Development', rating: 1, comment: 'غير راضي عن التنظيم', answered: false, createdDate: '2025-01-13' },
    // { id: 4, studentName: 'سارة خالد', courseTitle: 'UI/UX Design', rating: 4, comment: 'محتوى قيم ومفيد', answered: true, createdDate: '2025-01-12' },
    // { id: 5, studentName: 'عمر يوسف', courseTitle: 'Web Development', rating: 3, comment: 'جيد لكن يمكن أن يكون أفضل', answered: false, createdDate: '2025-01-11' },
    // { id: 6, studentName: 'نور أحمد', courseTitle: 'Mobile Development', rating: 5, comment: 'أفضل دورة تعلمتها!', answered: true, createdDate: '2025-01-10' },
    // { id: 7, studentName: 'ياسمين عبدالله', courseTitle: 'Data Science', rating: 2, comment: 'الشرح سريع جداً', answered: false, createdDate: '2025-01-09' },
    // { id: 8, studentName: 'كريم سعيد', courseTitle: 'UI/UX Design', rating: 4, comment: 'تجربة جيدة بشكل عام', answered: true, createdDate: '2025-01-08' },
  ];

  filteredReviews: Review[] = [];
  courses: string[] = [];
  
  activeTab: string = 'reviews';
  showNotAnswered: boolean = false;
  showWithComment: boolean = false;
  selectedRating: string = 'all';
  sortBy: string = 'lowest';
  selectedCourse: string = 'all';
  
  replyingTo: number | null = null;
  replyText: string = '';
  constructor(private ReviewService: ReviewService, private cdr:ChangeDetectorRef) {
       
    // this.filterReviews();

  }

  ngOnInit() {
    this.ReviewService.getReviews().subscribe(reviews => {
      this.reviews=reviews
     this.courses = ['all',...new Set(this.reviews.map(r => r.courseTitle))];
         this.filterReviews();
    this.cdr.detectChanges()
    });
   
    this.courses = ['all',...new Set(this.reviews.map(r => r.courseTitle))];
  }

  filterReviews() {
    let filtered = [...this.reviews];

    // Filter by course
    if (this.selectedCourse !== 'all') {
      filtered = filtered.filter(r => r.courseTitle === this.selectedCourse);
    }

    // Filter by answered status OR comment
    if (this.showNotAnswered && this.showWithComment) {
      filtered = filtered.filter(r => !r.answered || (r.comment && r.comment.trim() !== ''));
    } else if (this.showNotAnswered) {
      filtered = filtered.filter(r => !r.answered);
    } else if (this.showWithComment) {
      filtered = filtered.filter(r => r.comment && r.comment.trim() !== '');
    }

    // Filter by rating
    if (this.selectedRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(this.selectedRating));
    }

    // Sort
    if (this.sortBy === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (this.sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (this.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
    }

    this.filteredReviews = filtered;
  }

  onFilterChange() {
    this.filterReviews();
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  handleReply(reviewId: number) {
    this.replyingTo = reviewId;
    this.replyText = '';
  }

  handleSendReply(reviewId: number) {
    console.log('Sending reply to review', reviewId, ':', this.replyText);
    alert(`Reply sent successfully!\n\nYour reply: ${this.replyText}`);
    this.replyingTo = null;
    this.replyText = '';
  }

  handleCancelReply() {
    this.replyingTo = null;
    this.replyText = '';
  }

  exportToCSV() {
    const headers = ['Student Name', 'Course', 'Rating', 'Comment', 'Answered', 'Date'];
    const csvData = this.filteredReviews.map(r => [
      r.studentName,
      r.courseTitle,
      r.rating.toString(),
      r.comment,
      r.answered ? 'Yes' : 'No',
      r.createdDate
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviews.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getInitial(name: string): string {
    return name.charAt(0);
  }
}
