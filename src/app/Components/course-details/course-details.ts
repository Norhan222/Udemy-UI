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
  couponApplied: string | null = null;
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

    this.route.queryParamMap.subscribe((q) => {
      const coupon = q.get('couponCode') || q.get('coupon');
      if (coupon) {
        this.couponApplied = coupon;
        console.log('Coupon applied:', coupon);
      } else {
        this.couponApplied = null;
      }
    });
  }

  loadCourseDetails(courseId: any) {
    console.log('CourseDetails loadCourseDetails:', courseId);
    const idNum = Number(courseId);
    if (!courseId || isNaN(idNum)) {
      console.error('Invalid course id:', courseId);
      this.loading = false;
      return;
    }

    const requestUrl = `${this.courseService.baseUrl}/Course/Get/${idNum}`;
    console.log('Requesting URL:', requestUrl);

    this.courseService.getCourseById(idNum).subscribe(
      (c: any) => this.setCourseFromICourse(c),
      (err: any) => this.handleGetByIdError(err, idNum, courseId, requestUrl)
    );
  }

  private setCourseFromICourse(c: any) {
    console.log('setCourseFromICourse payload:', c);

    let instructors: any[] = [];
    if (Array.isArray(c.instructors) && c.instructors.length) {
      instructors = c.instructors;
    } else if (c.instructorName) {
      instructors = [
        {
          id: c.instructorId || 1,
          name: c.instructorName,
          title: c.instructorTitle || '',
          image: c.instructorImage || c.thumbnailUrl || 'https://via.placeholder.com/80?text=Instructor',
          rating: c.instructorRating || 0,
          students: c.studentCount || 0,
          bio: c.instructorBio || '',
        },
      ];
    }

    // derive fallback learning bullets from description when not provided
    const derivedLearn: string[] = (c.whatYouWillLearn && c.whatYouWillLearn.length)
      ? c.whatYouWillLearn
      : ((c.learningObjectives && c.learningObjectives.length)
          ? c.learningObjectives
          : ((c.description || c.shortDescription || '').split('.')
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0)
              .slice(0, 6)));

    this.course = {
      id: c.id,
      title: c.title || 'Untitled Course',
      description: c.description || c.shortDescription || '',
      category: c.topicName || c.category || 'General',
      price: c.price ?? 0,
      originalPrice: c.originalPrice ?? c.price ?? 0,
      rating: c.rating ?? 4.5,
      reviewCount: c.reviewCount ?? 0,
      studentCount: c.studentCount ?? 0,
      thumbnail: c.thumbnailUrl || c.thumbnail || 'https://via.placeholder.com/1280x720?text=Course',
      videoPreview: c.previewVideoUrl || c.previewVideo || '',
      level: c.level || 'All levels',
      language: c.language || 'English',
      duration: c.duration || 'Unknown',
      lastUpdated: c.lastUpdatedDate || c.lastUpdated || '',
      features: c.features || [],
      instructors: instructors,
      whatYouWillLearn: derivedLearn,
      requirements: c.requirements || (c.prerequisites ? [c.prerequisites] : []),
      curriculum: c.curriculum || c.sections || [],
      reviews: c.reviews || [],
    };

    this.loading = false;
  }

  private setMockCourse(courseId: any) {
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
  }

  private handleGetByIdError(err: any, idNum: number, courseId: any, requestUrl: string) {
    console.error('Could not load course from API, status:', err?.status, 'message:', err?.message, 'url:', requestUrl, err);

    this.courseService.getCourses().subscribe(
      (list: any[]) => {
        const found = list.find((x) => Number(x.id) === idNum);
        if (found) {
          console.log('Found course in fallback list, using it:', found.id);
          this.setCourseFromICourse(found);
        } else {
          console.warn('Fallback list did not contain course id', idNum, '— using mock data');
          this.setMockCourse(courseId);
        }
      },
      (listErr) => {
        console.error('Fallback getCourses failed', listErr);
        this.setMockCourse(courseId);
      }
    );
  }

  public toggleSection(sectionId: number) {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  public isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  public openVideoModal() {
    this.showVideoModal = true;
  }

  public closeVideoModal() {
    this.showVideoModal = false;
  }

  public addToCart() {
    this.cartAdded = true;
    setTimeout(() => {
      this.cartAdded = false;
    }, 2000);
  }

  public buyNow() {
    // quick buy action - add to cart then proceed (placeholder)
    this.addToCart();
    // TODO: integrate checkout flow
    console.log('Buy now clicked for course', this.course?.id);
  }

  public addToWishlist() {
    this.wishlistAdded = !this.wishlistAdded;
  }

  public getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  public formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
