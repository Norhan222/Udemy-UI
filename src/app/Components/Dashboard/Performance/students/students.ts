import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstructorService } from '../../../../Services/instructor-service';

@Component({
  selector: 'app-students',
  imports: [FormsModule,CommonModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  students: Student[] = [];
 constructor(private instructorService: InstructorService) {
    this.instructorService.getInstructorStudents().subscribe(data => {
      this.students = data;
       this.courses = this.getUniqueCourses();
    this.calculateCounts();
    this.filterStudents();
    });
 }

  //  = [
  //   { 
  //     id: 1, 
  //     name: 'أحمد محمد علي', 
  //     email: 'ahmed.mohamed@email.com', 
  //     enrolledCourses: [
  //       { title: 'Web Development Bootcamp', enrollDate: '2024-12-15', progress: 85, lastAccessed: '2 hours ago', rating: 5 },
  //       { title: 'JavaScript Mastery', enrollDate: '2024-11-20', progress: 60, lastAccessed: '1 day ago', rating: null }
  //     ],
  //     country: 'Egypt',
  //     totalWatchTime: '48h 30m'
  //   },
  //   { 
  //     id: 2, 
  //     name: 'Sarah Johnson', 
  //     email: 'sarah.j@email.com', 
  //     enrolledCourses: [
  //       { title: 'UI/UX Design Complete', enrollDate: '2024-11-20', progress: 45, lastAccessed: '3 hours ago', rating: 4 }
  //     ],
  //     country: 'USA',
  //     totalWatchTime: '24h 15m'
  //   },
  //   { 
  //     id: 3, 
  //     name: 'محمود حسن', 
  //     email: 'mahmoud.h@email.com', 
  //     enrolledCourses: [
  //       { title: 'Data Science Pro', enrollDate: '2024-10-10', progress: 100, lastAccessed: '1 week ago', rating: 5 },
  //       { title: 'Python Programming', enrollDate: '2024-10-15', progress: 95, lastAccessed: '2 days ago', rating: 5 },
  //       { title: 'Machine Learning A-Z', enrollDate: '2024-11-01', progress: 70, lastAccessed: '5 hours ago', rating: 4 }
  //     ],
  //     country: 'Saudi Arabia',
  //     totalWatchTime: '156h 45m'
  //   },
  //   { 
  //     id: 4, 
  //     name: 'فاطمة علي', 
  //     email: 'fatima.ali@email.com', 
  //     enrolledCourses: [
  //       { title: 'Mobile Development', enrollDate: '2025-01-05', progress: 20, lastAccessed: '30 minutes ago', rating: null }
  //     ],
  //     country: 'Egypt',
  //     totalWatchTime: '8h 20m'
  //   },
  //   { 
  //     id: 5, 
  //     name: 'John Smith', 
  //     email: 'john.smith@email.com', 
  //     enrolledCourses: [
  //       { title: 'Web Development Bootcamp', enrollDate: '2024-09-15', progress: 100, lastAccessed: '2 weeks ago', rating: 5 },
  //       { title: 'React Advanced Course', enrollDate: '2024-10-01', progress: 100, lastAccessed: '1 week ago', rating: 5 },
  //       { title: 'Node.js Complete Guide', enrollDate: '2024-11-10', progress: 88, lastAccessed: '1 day ago', rating: 4 }
  //     ],
  //     country: 'UK',
  //     totalWatchTime: '210h 30m'
  //   },
  // ];

  filteredStudents: Student[] = [];
  courses: string[] = [];
  
  searchTerm: string = '';
  selectedCourse: string = 'all';
  expandedStudent: number | null = null;
  activeTab: string = 'all';
  
  showMessageModal: boolean = false;
  showPerformanceModal: boolean = false;
  selectedStudentForAction: Student | null = null;
  messageText: string = '';
  messageSubject: string = '';

  stats = { totalStudents: 0, totalCourses: 0, completedCourses: 0, inProgressCourses: 0 };
  inProgressCount: number = 0;
  completedCount: number = 0;

  ngOnInit() {
    this.courses = this.getUniqueCourses();
    this.calculateCounts();
    this.filterStudents();
  }

  getUniqueCourses(): string[] {
    const allCourses = this.students.flatMap(s => s.enrolledCourses.map(c => c.title));
    return ['all', ...new Set(allCourses)];
  }

  calculateCounts() {
    this.inProgressCount = this.students.reduce((count, s) => 
      count + s.enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length, 0
    );
    this.completedCount = this.students.reduce((count, s) => 
      count + s.enrolledCourses.filter(c => c.progress === 100).length, 0
    );
  }

  filterStudents() {
    let filtered: Student[] = JSON.parse(JSON.stringify(this.students));

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.enrolledCourses.some(c => c.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Course filter
    if (this.selectedCourse !== 'all') {
      filtered = filtered.filter(s => 
        s.enrolledCourses.some(c => c.title === this.selectedCourse)
      );
    }

    // Tab filter
    if (this.activeTab === 'completed') {
      filtered = filtered
        .map(s => ({
          ...s,
          enrolledCourses: s.enrolledCourses.filter(c => c.progress === 100)
        }))
        .filter(s => s.enrolledCourses.length > 0);
    } else if (this.activeTab === 'in-progress') {
      filtered = filtered
        .map(s => ({
          ...s,
          enrolledCourses: s.enrolledCourses.filter(c => c.progress > 0 && c.progress < 100)
        }))
        .filter(s => s.enrolledCourses.length > 0);
    }

    this.filteredStudents = filtered;
    this.calculateStats();
  }

  calculateStats() {
    const allCoursesFromFiltered = this.filteredStudents.flatMap(s => s.enrolledCourses);
    
    this.stats = {
      totalStudents: this.filteredStudents.length,
      totalCourses: allCoursesFromFiltered.length,
      completedCourses: allCoursesFromFiltered.filter(c => c.progress === 100).length,
      inProgressCourses: allCoursesFromFiltered.filter(c => c.progress > 0 && c.progress < 100).length,
    };
  }

  onFilterChange() {
    this.filterStudents();
  }

  toggleExpand(studentId: number) {
    this.expandedStudent = this.expandedStudent === studentId ? null : studentId;
  }

  getProgressColor(progress: number): string {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-orange-500';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getStarArray(rating: number | null): number[] {
    return rating ? Array(5).fill(0).map((_, i) => i + 1) : [];
  }

  openMessageModal(student: Student) {
    this.selectedStudentForAction = student;
    this.showMessageModal = true;
    this.messageSubject = '';
    this.messageText = '';
  }

  openPerformanceModal(student: Student) {
    this.selectedStudentForAction = student;
    this.showPerformanceModal = true;
  }

  closeMessageModal() {
    this.showMessageModal = false;
    this.selectedStudentForAction = null;
    this.messageSubject = '';
    this.messageText = '';
  }

  closePerformanceModal() {
    this.showPerformanceModal = false;
    this.selectedStudentForAction = null;
  }

  sendMessage() {
    console.log('Sending message to:', this.selectedStudentForAction?.email);
    console.log('Subject:', this.messageSubject);
    console.log('Message:', this.messageText);
    alert(`Message sent successfully to ${this.selectedStudentForAction?.name}!`);
    this.closeMessageModal();
  }

  calculateStudentStats(student: Student): StudentStats {
    const totalCourses = student.enrolledCourses.length;
    const completedCourses = student.enrolledCourses.filter(c => c.progress === 100).length;
    const avgProgress = Math.round(
      student.enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses
    );
    const totalRatings = student.enrolledCourses.filter(c => c.rating).length;
    const avgRating = totalRatings > 0
      ? (student.enrolledCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / totalRatings).toFixed(1)
      : 'N/A';
    
    return { totalCourses, completedCourses, avgProgress, avgRating, totalRatings };
  }

  openMessageFromPerformance() {
    if (this.selectedStudentForAction) {
      this.closePerformanceModal();
      this.openMessageModal(this.selectedStudentForAction);
    }
  }
}
interface Course {
  title: string;
  enrollDate: string;
  progress: number;
  lastAccessed: string;
  rating: number | null;
}

interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: Course[];
  country: string;
  totalWatchTime: string;
}

interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  avgProgress: number;
  avgRating: string;
  totalRatings: number;
}