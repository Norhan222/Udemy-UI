import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICourse } from '../../Models/icourse';
import { CourseService } from '../../Services/course-service';
import { CommonModule } from '@angular/common';

interface Lecture {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
}

interface Section {
  id: number;
  title: string;
  completedLectures: number;
  totalLectures: number;
  totalDuration: string;
  collapsed: boolean;
  lectures: Lecture[];
}

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './learn.html',
  styleUrl: './learn.css',
})
export class Learn implements OnInit {
  courseId!: number;
  course!: ICourse;
  loading = true;

  // Video player state
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  progressPercent = 0;

  // UI state
  activeTab = 'overview';
  sidebarOpen = true;

  // Course sections (will be populated from API or default)
  sections: Section[] = [
    {
      id: 1,
      title: 'Section 1: Before you get started',
      completedLectures: 0,
      totalLectures: 1,
      totalDuration: '7min',
      collapsed: false,
      lectures: [
        {
          id: 1,
          title: '1. Using This Course with Any .NET Version: A Quick Guide',
          duration: '7min',
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: 'Section 2: Welcome',
      completedLectures: 0,
      totalLectures: 2,
      totalDuration: '15min',
      collapsed: true,
      lectures: []
    },
    {
      id: 3,
      title: 'Section 3: Getting Started',
      completedLectures: 0,
      totalLectures: 4,
      totalDuration: '19min',
      collapsed: true,
      lectures: []
    },
    {
      id: 4,
      title: 'Section 4: Building the Data Structure',
      completedLectures: 0,
      totalLectures: 6,
      totalDuration: '13min',
      collapsed: true,
      lectures: []
    },
    {
      id: 5,
      title: 'Section 5: Database Configuration and Management',
      completedLectures: 0,
      totalLectures: 6,
      totalDuration: '38min',
      collapsed: true,
      lectures: []
    },
    {
      id: 6,
      title: 'Section 6: Building and Managing Controllers',
      completedLectures: 0,
      totalLectures: 6,
      totalDuration: '15min',
      collapsed: true,
      lectures: []
    },
    {
      id: 7,
      title: 'Section 7: Understanding Views and UI Design',
      completedLectures: 0,
      totalLectures: 7,
      totalDuration: '55min',
      collapsed: true,
      lectures: []
    },
    {
      id: 8,
      title: 'Section 8: Managing Actor Data and Services',
      completedLectures: 0,
      totalLectures: 0,
      totalDuration: '',
      collapsed: true,
      lectures: []
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Learn Course ID:', this.courseId);
    this.loadCourse();
  }

  loadCourse(forceRefresh = false): void {
    this.loading = true;

    this.courseService.getCourseByIdtest(this.courseId, forceRefresh)
      .subscribe({
        next: (res) => {
          this.course = res;
          console.log('course:', res);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error loading course:', err);
        }
      });
  }

  // Toggle section collapse
  toggleSection(section: Section): void {
    section.collapsed = !section.collapsed;
  }

  // Toggle lecture completion
  toggleLectureCompletion(lecture: Lecture): void {
    lecture.completed = !lecture.completed;
    this.updateSectionProgress();
  }

  // Update section progress
  updateSectionProgress(): void {
    this.sections.forEach(section => {
      section.completedLectures = section.lectures.filter(l => l.completed).length;
    });
  }

  // Select lecture to play
  selectLecture(lecture: Lecture): void {
    console.log('Selected lecture:', lecture.title);
    // Here you would load the video for this lecture
  }

  // Video controls
  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
  }

  // Tab switching
  setTab(tab: string): void {
    this.activeTab = tab;
  }

  // Sidebar toggle
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Format time
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Go to next lecture
  goToNextLecture(): void {
    console.log('Going to next lecture');
  }
}