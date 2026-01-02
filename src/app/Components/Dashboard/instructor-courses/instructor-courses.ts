import { CourseService } from './../../../Services/course-service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, model, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ICourse } from '../../../Models/icourse';

@Component({
  selector: 'app-instructor-courses',
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './instructor-courses.html',
  styleUrl: './instructor-courses.css',
})
export class InstructorCourses implements OnInit {
  showEmailBanner: boolean = true;
  showUpdateBanner: boolean = true;
  searchTerm: string = '';
  sortOrder: string = 'newest';
  activeTab: string = 'courses';
  courses: ICourse[] = [];
  // courses: Course[] = [

  //   {
  //     id: 1,
  //     title: 'Web Development Bootcamp',
  //     students: 1234,
  //     rating: 4.8,
  //     lastUpdated: '2024-12-20'
  //   },
  //   {
  //     id: 2,
  //     title: 'React Advanced Concepts',
  //     students: 856,
  //     rating: 4.9,
  //     lastUpdated: '2024-12-15'
  //   },
  //   {
  //     id: 3,
  //     title: 'JavaScript Fundamentals',
  //     students: 2341,
  //     rating: 4.7,
  //     lastUpdated: '2024-12-10'
  //   },
  //   {
  //     id: 4,
  //     title: 'Angular Complete Guide',
  //     students: 1567,
  //     rating: 4.6,
  //     lastUpdated: '2024-12-05'
  //   }
  // ];
  filteredCourses: ICourse[] = [];

  constructor(private router: Router, private courseService: CourseService, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.courseService.getInstructorCourses().subscribe(courses => {
      console.log('Instructor courses fetched:', courses);
      this.courses = courses
      this.filteredCourses = [...this.courses];

      this.cdr.detectChanges()
    })
  };

  dismissEmailBanner(): void {
    this.showEmailBanner = false;
  }

  dismissUpdateBanner(): void {
    this.showUpdateBanner = false;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSortChange(): void {
    switch (this.sortOrder) {
      case 'newest':
        this.filteredCourses.sort((a, b) =>
          new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime()
        );
        break;
      case 'oldest':
        this.filteredCourses.sort((a, b) =>
          new Date(a.lastUpdatedDate).getTime() - new Date(b.lastUpdatedDate).getTime()
        );
        break;
      case 'title':
        this.filteredCourses.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
    }
  }

  createNewCourse(): void {
    console.log('Create new course clicked');
    // Navigate to create course page
    this.router.navigate(['/course-creation']);
  }

  editCourse(courseId: number): void {
    console.log('Edit course:', courseId);
    // Navigate to edit course page
  }

  receiveEmails(): void {
    console.log('Receive emails clicked');
    // Update user communication settings
  }
}


interface Course {
  id: number;
  title: string;
  students: number;
  rating: number;
  lastUpdated: string;
}
