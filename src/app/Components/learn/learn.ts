import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, CourseContent, Section, Lecture } from '../../Services/course-service';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn.html',
  styleUrls: ['./learn.css']
})
export class Learn implements OnInit {
  courseId!: number;
  course: CourseContent | null = null;
  selectedLecture: Lecture | null = null;
  loading = true;
  showFullDescription = false;
  activeTab = 'overview';
  sidebarVisible = true;

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  constructor(
    private courseService: CourseService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse() {
    this.courseService.getCourseContent(115).subscribe({
      next: (data) => {
        this.course = data;
        console.log("content", data);
        
        // Expand first section by default
        if (data.sections.length) {
          data.sections[0].expanded = true;
          
          if (data.sections[0].lectures.length) {
            this.selectLecture(data.sections[0].lectures[0]);
          }
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectLecture(lecture: Lecture) {
    this.selectedLecture = lecture;
    
    // Mark as completed
    if (lecture) {
      lecture.completed = true;
    }
    
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();
    }

    // Scroll to top of content area
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  }

  toggleSection(section: Section) {
    section.expanded = !section.expanded;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    // You can implement hiding/showing sidebar logic here
  }

  getCompletedLectures(section: Section): number {
    return section.lectures.filter(l => l.completed).length;
  }

  getSectionDuration(section: Section): string {
    // Calculate total duration
    // This is a simple example - you'll need to parse actual durations
    const totalMinutes = section.lectures.length * 7; // Assuming 7min per lecture
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}hr ${minutes}min`;
    }
    return `${minutes}min`;
  }

  onVideoEnded() {
    // Auto-play next lecture
    if (this.course && this.selectedLecture) {
      const nextLecture = this.findNextLecture();
      if (nextLecture) {
        this.selectLecture(nextLecture);
      }
    }
  }

  onTimeUpdate(event: Event) {
    // Track video progress if needed
    const video = event.target as HTMLVideoElement;
    const progress = (video.currentTime / video.duration) * 100;
    
    // You can save progress to backend here
    // this.courseService.saveProgress(this.courseId, this.selectedLecture.id, progress);
  }

  private findNextLecture(): Lecture | null {
    if (!this.course || !this.selectedLecture) return null;

    let foundCurrent = false;
    
    for (const section of this.course.sections) {
      for (const lecture of section.lectures) {
        if (foundCurrent) {
          return lecture;
        }
        if (lecture.id === this.selectedLecture.id) {
          foundCurrent = true;
        }
      }
    }
    
    return null;
  }
}