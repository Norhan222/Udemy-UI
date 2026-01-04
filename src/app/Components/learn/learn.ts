import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, CourseContent, Section, Lecture } from '../../Services/course-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../Services/review-service';
import { Rating } from 'primeng/rating';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule,Rating,ReactiveFormsModule],
  templateUrl: './learn.html',
  styleUrls: ['./learn.css']
})
export class Learn implements OnInit {
  courseId!: number;
  course?: CourseContent;
  selectedLecture?: Lecture;
  loading = true;
  showFullDescription = false;
  activeTab = 'overview';
  sidebarVisible = true;
  reviewForm!: FormGroup;
  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  private courseService=inject(CourseService);
  private route=inject(ActivatedRoute);
  private cd=inject(ChangeDetectorRef);


  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.reviewForm = this.fb.group({
      rating: [null,[Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }
  

  submitReview() {
    if (this.reviewForm.valid && this.course) {
      const review = {
        courseId: this.course.id,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment
      };

      this.reviewService.createReviewForCourse(review).subscribe({
        next: () => {
          alert('Review submitted successfully!');
          this.reviewForm.reset();
        },
        error: (err) => {
          if(err.error)
          {
            alert(err.error.message)
            console.log(err.error.message)
          }else
          {
            alert("UnException Eror")
          }
        }
      });
    }

  }


  loadCourse() {
    this.courseService.getCourseContent(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
        this.cd.detectChanges();
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
        this.cd.detectChanges();
      }
    });
  }

  selectLecture(lecture: Lecture) {
    this.selectedLecture = lecture;

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
    return section.lectures.filter(l => l.isCompleted).length;
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
    // Mark current lecture as complete
    if (this.selectedLecture && this.course) {
      this.markLectureAsComplete();
    }

    // Auto-play next lecture
    const nextLecture = this.findNextLecture();
    if (nextLecture) {
      setTimeout(() => {
        this.selectLecture(nextLecture);
      }, 1000); // Wait 1 second before playing next
    }
  }

 private lastSavedProgress = 0;

onTimeUpdate(event: Event) {
  const video = event.target as HTMLVideoElement;
  if (!video.duration || !this.selectedLecture) return;

  const progressInSeconds = Math.floor(video.currentTime);

  // ابعت كل 5 ثواني أو لما يكون فرق عن آخر حفظ
  if (progressInSeconds - this.lastSavedProgress >= 5) {
    this.saveVideoProgress(progressInSeconds);
    this.lastSavedProgress = progressInSeconds;
  }

  // Auto-mark as complete عند 90%
  if (!this.selectedLecture.isCompleted && video.currentTime / video.duration >= 0.9) {
    this.markLectureAsComplete();
  }
}


  private saveVideoProgress(progress: number) {
    if (!this.selectedLecture || !this.course) return;

    this.courseService.saveProgress(
      this.course.id,
      this.selectedLecture.id,
      progress
    ).subscribe({
      next: () => {
        console.log(`Progress saved: ${progress}%`);
      },
      error: (err) => {
        console.error('Error saving progress:', err);
      }
    });
  }

  private markLectureAsComplete() {
    if (!this.selectedLecture || !this.course) return;

    // Update UI immediately
    this.selectedLecture.isCompleted = true;

    // Save to backend
    this.courseService.markLectureComplete(
      this.course.id,
      this.selectedLecture.id
    ).subscribe({
      next: () => {
        console.log('Lecture marked as complete');
      },
      error: (err) => {
        console.error('Error marking lecture complete:', err);
        // Revert UI if API fails
        if (this.selectedLecture) {
          this.selectedLecture.isCompleted = false;
        }
      }
    });
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
