import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../../Services/instructor-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guideline-page',
  imports: [CommonModule],
  templateUrl: './guideline-page.html',
  styleUrl: './guideline-page.css',
})
export class GuidelinePage {
notificationId: number = 0;
  courseDetails: any = null;
  rejectionReasons: string[] = [];
  isLoading: boolean = true;

  guidelines = [
    {
      icon: '🎯',
      title: 'Course Content Quality',
      description: 'Ensure your course content is original, well-structured, and provides clear value to students.',
      points: [
        'Create comprehensive course outline with clear learning objectives',
        'Include high-quality video content (minimum 720p resolution)',
        'Provide supplementary materials (PDFs, exercises, resources)',
        'Break content into digestible sections and lectures'
      ]
    },
    {
      icon: '🎬',
      title: 'Video Production Standards',
      description: 'Maintain professional production quality throughout your course.',
      points: [
        'Use clear audio without background noise or echo',
        'Ensure good lighting and video clarity',
        'Keep videos engaging with appropriate pacing',
        'Add captions or subtitles when possible'
      ]
    },
    {
      icon: '📝',
      title: 'Course Description & Metadata',
      description: 'Write compelling and accurate course information.',
      points: [
        'Write clear, detailed course description',
        'Set appropriate skill level and prerequisites',
        'Choose relevant category and subcategory',
        'Create attractive course thumbnail (1280x720px)'
      ]
    },
    {
      icon: '✅',
      title: 'Platform Policies',
      description: 'Follow all platform guidelines and policies.',
      points: [
        'No copyrighted content without permission',
        'Original content created by you',
        'Professional and respectful language',
        'Accurate representation of course content'
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.notificationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRejectionDetails();
  }

  loadRejectionDetails() {
    this.isLoading = false;
    
    // استدعاء الـ API عشان تجيب تفاصيل الرفض
    // this.instructorService.getCourseRejectionDetails(this.notificationId).subscribe({
    //   next: (response:any) => {
    //     this.courseDetails = response.data;
    //     this.rejectionReasons = response.data.rejectionReasons || [];
    //     this.isLoading = false;
    //   },
    //   error: (error:any) => {
    //     console.error('Error loading rejection details:', error);
    //     this.isLoading = false;
    //     // في حالة الخطأ، استخدم بيانات تجريبية
    //     this.loadMockData();
    //   }
    // });
  }

  // بيانات تجريبية للتجربة
  loadMockData() {
    this.courseDetails = {
      courseTitle: 'Angular Complete Course',
      courseId: 123,
      submittedDate: '2024-12-25',
      rejectedDate: '2024-12-28'
    };
    this.rejectionReasons = [
      'Video quality is below platform standards (low resolution detected)',
      'Audio quality issues detected (background noise and unclear voice)',
      'Course description is too generic and doesn\'t clearly explain learning outcomes',
      'Missing course thumbnail image',
      'Incomplete course curriculum (less than minimum required lectures)'
    ];
    this.isLoading = false;
  }

  goBack() {
    this.router.navigate(['/instructor/dashboard']);
  }

  editCourse() {
    if (this.courseDetails?.courseId) {
      this.router.navigate(['/instructor/courses/edit', this.courseDetails.courseId]);
    }
  }

  contactSupport() {
    // Navigate to support page or open email
    window.location.href = 'mailto:support@yourplatform.com?subject=Course Rejection Query';
  }
}
