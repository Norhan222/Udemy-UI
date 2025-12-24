import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../Services/course-service';
import { CartService } from '../../Services/cart-service';
import { AuthService } from '../../Services/auth-service';

interface Instructor { id:number; name:string; title:string; image:string; rating:number; students:number; bio:string; }
interface Curriculum { sectionId:number; sectionTitle:string; lectures:{id:number; title:string; duration:string; isFree:boolean}[] }
interface Review { id:number; userName:string; userImage:string; rating:number; date:string; title:string; description:string; helpful:number }
interface CourseDetails {
  id:number; title:string; description:string; category:string; price:number; originalPrice:number;
  rating:number; reviewCount:number; studentCount:number; thumbnail:string; videoPreview:string;
  instructors:Instructor[]; level:string; language:string; duration:string; lastUpdated:string;
  whatYouWillLearn:string[]; requirements:string[]; curriculum:Curriculum[]; reviews:Review[]; features:string[];
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
  expandedSections = new Set<number>();
  cartAdded = false;
  wishlistAdded = false;
  couponApplied: string | null = null;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}
 private auth = inject(AuthService);
private router = inject(Router);
  private cartService = inject(CartService);
  cartItems: any[] = []; 
  cartLoaded = false;

  ngOnInit(): void {
 
  this.cartService.getCart().subscribe({
  next: (res: any) => {
    this.cartItems = res.data.items;
    this.cartLoaded = true;

    console.log('CART ITEMS:', this.cartItems);
    this.cdr.detectChanges();
  },
  error: (er) => {
    this.cartLoaded = true;
    console.error('Error fetching cart items:', er);
  }
});


    // listen to route id changes
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.loadCourseDetails(id);
      }
    });

    // listen to query params (coupon)
    this.route.queryParamMap.subscribe(q => {
      this.couponApplied = q.get('couponCode') || q.get('coupon');
    });
   
  }
  isInCart(courseId: number | null | undefined): boolean {
  if (!courseId || !this.cartItems?.length) return false;
  return this.cartItems.some(item => item.courseId === courseId);
}

    addToCart(id: any): void {

  // ❌ لو مش عامل Login
  if (!this.auth.getToken()) {
    this.router.navigate(['/Login'], {
      queryParams: { returnUrl: `/course/${id}` }
    });
    return;
  }

  // ✅ لو عامل Login
  this.cartService.addToCart(id).subscribe({
    next: (res) => {
      console.log('addCart', res);
      this.cartAdded = true;
       this.cartItems.push({ courseId: id, ...res.data }); 
      this.cdr.detectChanges(); // force update
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  private loadCourseDetails(courseId: number): void {
    this.loading = true;
    this.course = null;

    this.courseService.getCourseById(courseId).subscribe({
      next: courseData => {
        // ✅ ensure Angular zone updates the UI
        this.zone.run(() => {
          this.mapCourse(courseData);
        });
      },
      error: () => {
        // fallback to all courses if single fetch fails
        this.courseService.getCourses().subscribe(list => {
          const found = list.find(x => Number(x.id) === courseId);
          this.zone.run(() => {
            if (found) this.mapCourse(found);
            else this.loading = false;
          });
        });
      }
    });
  }

  private mapCourse(c: any): void {
    const instructors = Array.isArray(c.instructors) && c.instructors.length
      ? c.instructors
      : [{
          id: c.instructorId || 1,
          name: c.instructorName || 'Instructor',
          title: c.instructorTitle || '',
          image: c.instructorImage || 'https://via.placeholder.com/80',
          rating: c.instructorRating || 0,
          students: c.studentCount || 0,
          bio: c.instructorBio || '',
        }];

    const whatYouWillLearn = c.whatYouWillLearn?.length
      ? c.whatYouWillLearn
      : (c.description || '').split('.').map((s: string) => s.trim()).filter(Boolean).slice(0, 6);

    this.course = {
      id: c.id,
      title: c.title || 'Untitled Course',
      description: c.description || '',
      category: c.topicName || c.category || 'General',
      price: c.price ?? 0,
      originalPrice: c.originalPrice ?? c.price ?? 0,
      rating: c.rating ?? 4.5,
      reviewCount: c.reviewCount ?? 0,
      studentCount: c.studentCount ?? 0,
      thumbnail: c.thumbnailUrl || 'https://via.placeholder.com/1280x720',
      videoPreview: c.previewVideoUrl || '',
      instructors,
      level: c.level || 'All levels',
      language: c.language || 'English',
      duration: c.duration || 'Unknown',
      lastUpdated: c.lastUpdated || '',
      features: c.features || [],
      whatYouWillLearn,
      requirements: c.requirements || [],
      curriculum: c.curriculum || [],
      reviews: c.reviews || [],
    };

    this.loading = false;
    this.cdr.detectChanges(); // ✅ force UI update
  }

  toggleSection(sectionId: number): void {
    this.expandedSections.has(sectionId)
      ? this.expandedSections.delete(sectionId)
      : this.expandedSections.add(sectionId);
  }

  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  openVideoModal(): void { this.showVideoModal = true; }
  closeVideoModal(): void { this.showVideoModal = false; }
 

  buyNow(): void {  }
  addToWishlist(): void { this.wishlistAdded = !this.wishlistAdded; }

  getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  }
}
