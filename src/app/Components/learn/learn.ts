import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CourseContent,
  CourseService,
  Lecture,
  Section,
} from '../../Services/course-service';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './learn.html',
  styleUrl: './learn.css',
})
export class Learn implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  course!: CourseContent;
  sections: Section[] = [];
  selectedLecture?: Lecture;

  loading = false;
  sidebarOpen = true;

  // video state
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  playbackRate = 1;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourseContent(courseId);
    }
  }

  loadCourseContent(courseId: number): void {
    this.loading = true;

    this.courseService.getCourseContent(courseId).subscribe({
      next: res => {
        this.course = res;

        this.sections = res.sections.map(s => ({
          ...s,
          collapsed: true,
          totalLectures: s.lectures.length,
          completedLectures: 0,
          totalDuration: this.calcSectionDuration(s.lectures),
          lectures: s.lectures.map(l => ({
            ...l,
            completed: false,
          })),
        }));

        // افتح أول section
        if (this.sections.length) {
          this.sections[0].collapsed = false;
        }

        // اختار أول lecture لو ليه فيديو
        const firstLecture = this.sections[0]?.lectures.find(
          l => l.videoUrl
        );
        if (firstLecture) {
          this.selectLecture(firstLecture);
        }

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  selectLecture(lecture: Lecture): void {
    if (!lecture.videoUrl) return;

    this.selectedLecture = lecture;

    setTimeout(() => {
      this.videoPlayer?.nativeElement.load();
    });
  }

  toggleLectureCompletion(lecture: Lecture, event: Event): void {
    event.stopPropagation();
    lecture.completed = !lecture.completed;
    this.updateProgress();
  }

  updateProgress(): void {
    this.sections.forEach(section => {
      section.completedLectures = section.lectures.filter(
        l => l.completed
      ).length;
    });
  }

  calcSectionDuration(lectures: Lecture[]): string {
    const totalSeconds = lectures.reduce(
      (sum, l) => sum + (l.duration ?? 0),
      0
    );
    const mins = Math.floor(totalSeconds / 60);
    return `${mins}m`;
  }

  toggleSection(section: Section): void {
    section.collapsed = !section.collapsed;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  togglePlayPause(): void {
    const video = this.videoPlayer?.nativeElement;
    if (!video) return;

    video.paused ? video.play() : video.pause();
  }

  onTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.currentTime = video.currentTime;
    this.duration = video.duration;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  seekTo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.currentTime = (+input.value / 100) * video.duration;
    }
  }

  changePlaybackRate(rate: number): void {
    this.playbackRate = rate;
    this.videoPlayer.nativeElement.playbackRate = rate;
  }

  getProgressPercentage(): number {
    const total = this.sections.reduce(
      (sum, s) => sum + (s.totalLectures ?? 0),
      0
    );
    const done = this.sections.reduce(
      (sum, s) => sum + (s.completedLectures ?? 0),
      0
    );
    return total ? Math.round((done / total) * 100) : 0;
  }
}
