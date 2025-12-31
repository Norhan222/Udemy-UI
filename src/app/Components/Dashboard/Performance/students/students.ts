import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InstructorService } from '../../../../Services/instructor-service';

@Component({
  selector: 'app-students',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  students: Student[] = [];
  constructor(private instructorService: InstructorService, private cdr: ChangeDetectorRef
  ) {

  }



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
    this.instructorService.getInstructorStudents().subscribe(data => {
      this.students = data;
      this.courses = this.getUniqueCourses();
      this.calculateCounts();
      this.filterStudents();
      this.cdr.detectChanges();
    });
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
  profileImageUrl:string;
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