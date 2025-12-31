import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, CourseContent, Section, Lecture } from '../../Services/course-service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './learn.html',
  styleUrls: ['./learn.css']
})
export class Learn implements OnInit {
  courseId!: number;
  course: CourseContent | null = null;
  selectedLecture: Lecture | null = null;
  loading = true;
  showFullDescription = false;  // ✅ لإظهار الوصف كامل عند الضغط

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  constructor(private courseService: CourseService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse() {
    this.courseService.getCourseContent(99).subscribe({
      next: (data) => {
        this.course = data;
        if (data.sections.length && data.sections[0].lectures.length) {
          this.selectLecture(data.sections[0].lectures[0]);
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
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();
    }
  }
}

