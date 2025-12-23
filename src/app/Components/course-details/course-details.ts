import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../Services/course-service';

interface Instructor {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  students: number;
  bio: string;
}

interface Curriculum {
  sectionId: number;
  sectionTitle: string;
  lectures: Array<{
    id: number;
    title: string;
    duration: string;
    isFree: boolean;
  }>;
}

interface Review {
  id: number;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  title: string;
  description: string;
  helpful: number;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  thumbnail: string;
  videoPreview: string;
  instructors: Instructor[];
  level: string;
  language: string;
  duration: string;
  lastUpdated: string;
  whatYouWillLearn: string[];
  requirements: string[];
  curriculum: Curriculum[];
  reviews: Review[];
  features: string[];
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetailsComponent implements OnInit {
  course: CourseDetails | null = null;
  loading = true;
  showVideoModal = false;
  expandedSections: Set<number> = new Set();
  cartAdded = false;
  wishlistAdded = false;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const courseId = params['id'];
      this.loadCourseDetails(courseId);
    });
  }

  loadCourseDetails(courseId: any) {
    // try to load from API; if it fails, fall back to mock data
    console.log('CourseDetails loadCourseDetails:', courseId);
    this.courseService.getCourseById(Number(courseId)).subscribe((c:any) => {
      // Map minimal available fields from ICourse to CourseDetails
      this.course = {
        id: c.id,
        title: c.title || 'Untitled Course',
        description: c.description || '',
        category: c.topicName || 'General',
        price: c.price || 0,
        originalPrice: c.price || 0,
        rating: 4.5,
        reviewCount: 0,
        studentCount: 0,
        thumbnail: c.thumbnailUrl || 'https://via.placeholder.com/1280x720?text=Course',
        videoPreview: c.previewVideoUrl || '',
        level: c.level || 'All levels',
        language: c.language || 'English',
        duration: 'Unknown',
        lastUpdated: c.lastUpdatedDate || '',
        features: [],
        instructors: [],
        whatYouWillLearn: [],
        requirements: [],
        curriculum: [],
        reviews: []
      };
      this.loading = false;
    }, err => {
      console.warn('Could not load course from API, using mock. Error:', err);
      // fallback to existing mock data
      this.course = {
        id: courseId,
        title: 'The Complete JavaScript Course 2024: From Zero to Expert',
        description:
          'Learn JavaScript from the ground up with the most complete and up-to-date course. Build real projects with ES6+, async/await, OOP, functional programming, and more.',
        category: 'Development',
        price: 14.99,
        originalPrice: 79.99,
        rating: 4.8,
        reviewCount: 1234567,
        studentCount: 15000000,
        thumbnail: 'https://via.placeholder.com/1280x720?text=JavaScript+Course',
        videoPreview:
          'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
        level: 'Beginner to Advanced',
        language: 'English',
        duration: '50 hours',
        lastUpdated: 'December 2024',
        features: [
          'Lifetime access',
          '50 hours of content',
          'Certificate of completion',
          '30-day money-back guarantee',
          'Access on mobile and desktop',
        ],
        instructors: [
          {
            id: 1,
            name: 'Jonas Schmedtmann',
            title: 'Web Developer & Designer',
            image: 'https://via.placeholder.com/80?text=Instructor',
            rating: 4.8,
            students: 15000000,
            bio: 'I am a full-stack web developer with a passion for teaching. I have created multiple courses that have helped millions of students learn web development.',
          },
        ],
        whatYouWillLearn: [
          'Master JavaScript from basics to advanced concepts',
          'Understand asynchronous programming with promises and async/await',
          'Build real-world projects with ES6+ features',
          'Learn object-oriented and functional programming',
          'Master the DOM and build interactive websites',
          'Work with APIs and consume data from servers',
          'Understand modern JavaScript tooling and workflow',
          'Deploy your applications to the web',
        ],
        requirements: [
          'No prior programming experience required',
          'A computer and internet connection',
          'Basic understanding of HTML (will be covered)',
          'Willingness to practice and build projects',
        ],
        curriculum: [
          {
            sectionId: 1,
            sectionTitle: 'Introduction and Getting Started',
            lectures: [
              { id: 1, title: 'Welcome to the course', duration: '5:32', isFree: true },
              { id: 2, title: 'Setting up your environment', duration: '12:45', isFree: true },
              { id: 3, title: 'Your first JavaScript program', duration: '8:20', isFree: false },
            ],
          },
          {
            sectionId: 2,
            sectionTitle: 'Fundamentals: Variables and Data Types',
            lectures: [
              { id: 4, title: 'Understanding variables', duration: '15:30', isFree: false },
              { id: 5, title: 'Data types explained', duration: '18:45', isFree: false },
              { id: 6, title: 'Working with strings', duration: '12:15', isFree: false },
              { id: 7, title: 'Numbers and math operations', duration: '14:20', isFree: false },
            ],
          },
          {
            sectionId: 3,
            sectionTitle: 'Control Flow and Functions',
            lectures: [
              { id: 8, title: 'If statements and conditions', duration: '16:45', isFree: false },
              { id: 9, title: 'Loops and iterations', duration: '19:30', isFree: false },
              { id: 10, title: 'Functions and scope', duration: '22:15', isFree: false },
              { id: 11, title: 'Arrow functions', duration: '13:45', isFree: false },
            ],
          },
        ],
        reviews: [
          {
            id: 1,
            userName: 'John Doe',
            userImage: 'https://via.placeholder.com/40?text=User',
            rating: 5,
            date: '2 weeks ago',
            title: 'Excellent course!',
            description:
              'This is the best JavaScript course I have ever taken. The instructor explains everything clearly and the projects are very practical.',
            helpful: 243,
          },
          {
            id: 2,
            userName: 'Jane Smith',
            userImage: 'https://via.placeholder.com/40?text=User2',
            rating: 5,
            date: '1 month ago',
            title: 'Life-changing',
            description:
              'I went from zero knowledge to building real applications. The progression is perfect and the explanations are top-notch.',
            helpful: 189,
          },
          {
            id: 3,
            userName: 'Mike Johnson',
            userImage: 'https://via.placeholder.com/40?text=User3',
            rating: 4,
            date: '2 months ago',
            title: 'Great content, a bit fast-paced',
            description: 'Very comprehensive course. Could be a bit slower for complete beginners, but overall excellent.',
            helpful: 156,
          },
        ],
      };
      this.loading = false;
    });
  }

  toggleSection(sectionId: number) {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  openVideoModal() {
    this.showVideoModal = true;
  }

  closeVideoModal() {
    this.showVideoModal = false;
  }

  addToCart() {
    this.cartAdded = true;
    setTimeout(() => {
      this.cartAdded = false;
    }, 2000);
  }

  addToWishlist() {
    this.wishlistAdded = !this.wishlistAdded;
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
