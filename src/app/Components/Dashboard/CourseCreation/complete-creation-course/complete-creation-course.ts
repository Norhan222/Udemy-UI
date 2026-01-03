import { Lecture } from './../../../../Models/lecture';
import { Category } from './../../../../Models/category';
import { CourseFormData, StepperService } from './../../../../Services/stepper-service';
import { CommonModule } from '@angular/common';
import { Section } from './../../../../Models/section';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../../Models/course';
import { Title } from '@angular/platform-browser';
import { CourseService } from '../../../../Services/course-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ICourse } from '../../../../Models/icourse';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryService } from '../../../../Services/category-service';
import { SubCategory } from '../../../../Models/sub-category';
import { TopicService } from '../../../../Services/topic-service';
import { Topic } from '../../../../Models/topic';

@Component({
  selector: 'app-complete-creation-course',
  imports: [CommonModule,FormsModule,RouterModule,TranslatePipe],
  templateUrl: './complete-creation-course.html',
  styleUrl: './complete-creation-course.css',
})
export class CompleteCreationCourse implements OnInit {

course!:Course;
editCourse!:ICourse;
sectionss:Section[]=[];
courseData!:CourseFormData;
courseTitle:string |null='';
courseDescription :string | null='';
category:number=0;
courseId!:Number;
isLoading:boolean=false;
hasUnsavedChanges = false;
approvalStatus:string=''
showRequirementsModal = false;




///////edit
  isSaving = false;
  originalCourseData: any = null
  /////////
activePage = 'course-landing';
editSections:Section[]=[];
  sections:Section[]=[]
  // = [
  //   {
  //     id: 1,
  //     title: 'Introduction',
  //     expanded: false,
  //     lectures: [
  //       { id: 1, title: 'Introduction', type: 'lecture', contentType: 'video', videoUrl: null }
  //     ]
  //   }
  // ];

  // Course Landing Page Data
  courseSubtitle = '';
  language = this.editCourse?.language;
  level = '';
  topicId:number=0;
  subcategory:number =0;
  primaryTopic = '';

  // Pricing Page Data
  currency = 'USD';
  priceTier = '';
constructor(private courseService:CourseService ,private StepperService:StepperService,private route:ActivatedRoute,
  private router:Router,private cdr:ChangeDetectorRef
  ,private cat:CategoryService
  ,private  topic:TopicService
){
  this.course=new Course();

}
  ngOnInit(): void {


 this.route.paramMap.subscribe(params => {
      const Id = params.get('id');
      if (Id) {
        this.courseId = +Id;
        this.isLoading = true;
        this.loadCourse(this.courseId);

      } else {
        // ✅ لو مفيش ID يبقى كورس جديد
        this.initializeNewCourse();

      }

    });

  }
  // Curriculum Data
  showCurriculumInfo = true;
  showNewFeatureInfo = true;
  showContentModal = false;
  showSectionModal = false;
  showLectureModal = false;
  showVideoUploadModal = false;
  showSuccessModal = false;
  isSubmitting = false;
  selectedLecture: any = null;
  newSectionTitle = '';
  newSectionObjective = '';
  editingSectionId: number | null = null;
  courseImage: File | null = null;
  courseImagePreview: string | null = null;
  newLectureTitle = '';
  editingLecture: any = null;
  videoFile: File | null = null;
  videoFileName = 'No file selected';
  promoVideo: File | null = null;
  promoVideoPreview: string | null = null;



  // Editor States
  isBold = false;
  isItalic = false;

  sidebarSections: SidebarSection[] = [

    {
      title: 'Create your content',
      items: [
        { name: 'Film & edit', completed: false, page: 'film-edit' },
        { name: 'Curriculum', completed: false, page: 'curriculum' },
        { name: 'Captions (optional)', completed: false, page: 'captions' },
        { name: 'Accessibility (optional)', completed: false, page: 'accessibility' }
      ]
    },
    {
      title: 'Publish your course',
      items: [
        { name: 'Course landing page', completed: false, active: true, page: 'course-landing' },
        { name: 'Pricing', completed: false, page: 'pricing' },
        { name: 'Promotions', completed: false, page: 'promotions' },
        { name: 'Course messages', completed: false, page: 'messages' }
      ]
    }
  ];

  languages = ['English (US)', 'Arabic', 'Spanish', 'French', 'German'];
  levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  categories:Topic[] =[] //['Design', 'Development', 'Business', 'Marketing'];
  subcategories :SubCategory[]=[] //= ['Web Design', 'Graphic Design', 'UI/UX', 'Game Design'];
  currencies = ['USD', 'EUR', 'GBP', 'EGP'];
  priceTiers = ['Free', '$19.99', '$29.99', '$49.99', '$99.99', '$199.99'];

initializeNewCourse(): void {
    this.courseData = this.StepperService.getFormData();
    this.courseTitle = this.courseData?.courseTitle || '';
    this.courseDescription = this.courseData?.description || '';
    this.category = this.courseData?.category
    this.cat.getSubCategories(this.category).subscribe(data=>{
    this.subcategories=data
    this.cdr.detectChanges()
  })
    this.sections = [
      {
        id: 1,
        title: 'Introduction',
        expanded: false,
        orderIndex:0,
        lectures: [
          {
            id: 1,
            title: 'Introduction',
            type: 'lecture',
            orderIndex:0,
            contentType: '',
            videoUrl: null
          }
        ]
      }
    ];
  }


loadCourse(id: Number): void {
    this.isLoading = true;

    this.courseService.getInstructorCourseById(id).subscribe({
      next: (course) => {
        console.log('Course loaded successfully:', course);
        this.editCourse = course;

        // ✅ املأ الـ data من الكورس اللي جاي
        this.populateCourseData();

        this.isLoading = false;
       this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Error fetching course:', error);
        this.isLoading = false;

        // ✅ لو فيه error، ابدأ بكورس جديد
        this.initializeNewCourse();
                this.cdr.detectChanges();

      }
    });
  }

populateCourseData(): void {
    if (!this.editCourse) {
      this.initializeNewCourse();
      return;
    }

    // ✅ Course Basic Info
    this.courseTitle = this.editCourse.title || '';
    this.courseDescription = this.editCourse.description || '';
    this.courseSubtitle = this.editCourse.shortDescription || '';
    this.subcategory =this.editCourse.subcategoryId;
    this.topicId=this.editCourse.tpoicId;
    this.category=this.editCourse.categoryId;
    this.language = this.editCourse.language || 'English (US)';
    this.level = this.editCourse.level || '';
    this.primaryTopic = '';
    this.approvalStatus=this.editCourse.approvalStatus

    this.cat.getSubCategories(this.category).subscribe(data=>{
      this.subcategories=data
    })

    // ✅ Pricing
    if (this.editCourse.price === 0) {
      this.priceTier = 'Free';
    } else if (this.editCourse.price) {
      this.priceTier = `$${this.editCourse.price}`;
    }

    // ✅ Course Images/Videos
    this.courseImagePreview = this.editCourse.thumbnailUrl || null;
    this.promoVideoPreview = this.editCourse.previewVideoUrl || null;

    // ✅ Sections & Lectures
    this.populateSections();

    //////////////////edit
       // ✅ احفظ نسخة من الداتا الأصلية
    this.saveOriginalData();

    // ✅ ابدأ تتبع التغييرات
    this.startChangeTracking();
    //////////////////
    console.log('Course data populated:', {
      title: this.courseTitle,
      description: this.courseDescription,
      sections: this.sections,
      price: this.priceTier
    });
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
populateSections(): void {
    if (!this.editCourse?.sections || this.editCourse.sections.length === 0) {
      // ✅ لو مفيش sections، ابدأ بـ default section
      this.sections = [
        {
          id: 1,
          title: 'Introduction',
          expanded: false,
          orderIndex:0,
          lectures: [
            {
              id: 1,
              title: 'Introduction',
              type: 'lecture',
              orderIndex:0,
              contentType: '',
              videoUrl: null
            }
          ]
        }
      ];
      return;
    }

    // ✅ املأ الـ sections من الكورس
    this.sections = [];

    this.editCourse.sections.forEach((sec, index) => {
      const section: Section = {
        id: sec.id || index + 1,
        title: sec.title || `Section ${index + 1}`,
        expanded: sec.expanded || false,
        orderIndex:sec.orderIndex ??index,
        lectures: []
      };

      // ✅ املأ الـ lectures
      if (sec.lectures && sec.lectures.length > 0) {
        sec.lectures.forEach((lec, lecIndex) => {
          const lecture: Lecture = {
            id: lec.id || lecIndex + 1,
            title: lec.title || `Lecture ${lecIndex + 1}`,
            type: lec.type || 'lecture',
            contentType: lec.contentType || '',
            orderIndex:lec.orderIndex??lecIndex,
            videoUrl: lec.videoUrl || null
          };
          section.lectures.push(lecture);
        });
      }

      this.sections.push(section);
    });

    console.log('Sections populated:', this.sections);
        this.cdr.markForCheck();

  }





  navigateToPage(item: SidebarItem): void {
    // Remove active from all items
    this.sidebarSections.forEach(section => {
      section.items.forEach(i => {
        i.active = false;
      });
    });

    // Set clicked item as active
    item.active = true;
    this.activePage = item.page || 'course-landing';
  }

  applyFormatting(type: string): void {
    if (type === 'bold') {
      this.isBold = !this.isBold;
    } else if (type === 'italic') {
      this.isItalic = !this.isItalic;
    }
  }
  onPreview(): void {
    console.log('Opening preview...');
  }
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
  getTotalLecturesCount(): number {
  if (!this.sections) return 0;

  return this.sections.reduce(
    (total, section) => total + (section.lectures?.length || 0),
    0
  );
}


// ✅ Helper methods للـ requirements
getTotalVideoMinutes(): number {
  // هنا ممكن تحسب الوقت الفعلي للفيديوهات
  // دلوقتي هنرجع 0 لحد ما تعمل الحساب الصحيح
  return 0;
}

allLecturesHaveContent(): boolean {
  return this.sections.every(section =>
    section.lectures.every(lecture => lecture.contentType && lecture.contentType.length > 0))||
    this.editSections.every(section =>
    section.lectures.every(lecture => lecture.contentType && lecture.contentType.length > 0));
}

closeRequirementsModal(): void {
  this.showRequirementsModal = false;
}

navigateToPageFromModal(pageName: string): void {
  this.closeRequirementsModal();

  // Find the item and navigate
  this.sidebarSections.forEach(section => {
    section.items.forEach(item => {
      if (item.page === pageName) {
        this.navigateToPage(item);
      }
    });
  });
}









onSubmitForReview(): void {
  // ✅ 1. Validation
  if (!this.canSubmitForReview()) {
    this.showRequirementsModal = true;
    return;
  }

  this.isSubmitting = true;

  // ✅ تحقق إذا كان كورس موجود (Edit Mode) أو جديد (Create Mode)
  if (this.courseId && this.editCourse) {
    // Edit Mode - استخدم دالة التحديث
    this.submitExistingCourseForReview();
  } else {
    // Create Mode - استخدم دالة الإنشاء
    this.submitNewCourseForReview();
  }
}




private submitExistingCourseForReview(): void {
  // املأ بيانات الكورس
  const formData = this.prepareFormData();

  // ✅ إرسال البيانات للـ Backend (Update)
  this.courseService.updateInstructorCourse(this.courseId, formData).subscribe({
    next: (response) => {
      console.log('✅ Course updated and submitted for review!', response);
      this.isSubmitting = false;
      this.showSuccessModal = true;
      this.hasUnsavedChanges = false;

      // حدّث الداتا الأصلية
      this.saveOriginalData();

      alert('Course updated and submitted for review successfully!');
      this.router.navigateByUrl('dashboard/courses');
    },
    error: (error) => {
      console.error('❌ Error updating course:', error);
      this.isSubmitting = false;
      this.handleSubmitError(error);
    }
  });
}

// ✅ دالة لإنشاء كورس جديد
private submitNewCourseForReview(): void {
  const formData = this.prepareFormData();

  this.courseService.createCourse(formData).subscribe({
    next: (response) => {
      console.log('✅ Course created successfully!', response);
      this.isSubmitting = false;
      this.showSuccessModal = true;
      alert('Course created successfully!');
      this.router.navigateByUrl('dashboard/courses');
    },
    error: (error) => {
      console.error('❌ Error creating course:', error);
      this.isSubmitting = false;
      this.handleSubmitError(error);
    }
  });
}



private prepareFormData(): FormData {
  const formData = new FormData();

  // Course Basic Info
  if (this.courseId) {
    formData.append('Id', this.courseId.toString());
  }

  formData.append('Title', this.courseTitle ?? '');
  formData.append('ShortTitle', this.courseSubtitle);
   formData.append('TopicId', this.topicId.toString());
  formData.append('SubCategoryId', this.subcategory.toString());
  formData.append('CategoryId', this.category.toString());
  formData.append('Level', this.level);
  formData.append('Language', this.language);
  formData.append('Price', this.getPriceValue().toString());
  formData.append('Description', this.courseDescription ?? '');

  if (this.primaryTopic) {
    formData.append('PrimaryTopic', this.primaryTopic);
  }

  // ✅ Thumbnail (إذا تم تحميل صورة جديدة)
  if (this.courseImage && this.courseImage instanceof File) {
    formData.append('Thumbnail', this.courseImage, this.courseImage.name);
  }

  // ✅ Preview Video (إذا تم تحميل فيديو جديد)
  if (this.promoVideo && this.promoVideo instanceof File) {
    formData.append('PreviewVideo', this.promoVideo, this.promoVideo.name);
  }

  // ✅ رتب الـ Sections والـ Lectures
  this.sections.forEach((s, i) => {
    s.orderIndex = i;
    s.lectures.forEach((l, j) => {
      l.orderIndex = j;
    });
  });

  // ✅ Sections & Lectures
  this.sections.forEach((section, sectionIndex) => {
    // Include section ID if editing
    if (section.id) {
      formData.append(`Sections[${sectionIndex}].Id`, section.id.toString());
    }

    formData.append(`Sections[${sectionIndex}].Title`, section.title);
    formData.append(`Sections[${sectionIndex}].orderIndex`, section.orderIndex.toString());

    section.lectures.forEach((lecture, lectureIndex) => {
      // Include lecture ID if editing
      if (lecture.id) {
        formData.append(
          `Sections[${sectionIndex}].Lectures[${lectureIndex}].Id`,
          lecture.id.toString()
        );
      }

      formData.append(
        `Sections[${sectionIndex}].Lectures[${lectureIndex}].Title`,
        lecture.title
      );
      formData.append(
        `Sections[${sectionIndex}].Lectures[${lectureIndex}].orderIndex`,
        lecture.orderIndex.toString()
      );

      if (lecture.contentType) {
        formData.append(
          `Sections[${sectionIndex}].Lectures[${lectureIndex}].ContentType`,
          lecture.contentType
        );
      }

      // ✅ فقط أرسل الفيديو إذا كان File object جديد
      if (lecture.videoUrl && lecture.videoUrl instanceof File) {
        formData.append(
          `Sections[${sectionIndex}].Lectures[${lectureIndex}].Video`,
          lecture.videoUrl,
          lecture.videoUrl.name
        );
      }
    });
  });

  return formData;
}

// ✅ دالة مساعدة للحصول على قيمة السعر
private getPriceValue(): number {
  if (this.priceTier === 'Free') {
    return 0;
  }
  const priceString = this.priceTier.replace('$', '').trim();
  return parseFloat(priceString) || 0;
}

// ✅ دالة مساعدة لمعالجة أخطاء الإرسال
private handleSubmitError(error: any): void {
  let errorMessage = 'Failed to submit course. ';

  if (error.error?.errors) {
    const errors = error.error.errors;
    errorMessage += Object.keys(errors)
      .map(key => `${key}: ${errors[key].join(', ')}`)
      .join('\n');
  } else if (error.error?.message) {
    errorMessage += error.error.message;
  } else if (error.message) {
    errorMessage += error.message;
  } else {
    errorMessage += 'Please try again.';
  }

  alert(errorMessage);
}

// ✅ حدّث دالة canSubmitForReview لتشمل التحقق من الفيديوهات بشكل صحيح
canSubmitForReview(): boolean {
    const hasTitle = (this.courseTitle?.trim().length ?? 0) > 0;
    const hasSubtitle = (this.courseSubtitle?.trim().length ?? 0) > 0;
    const hasDescription = (this.courseDescription?.trim().length ?? 0) >= 200;
    const hasLevel = (this.level?.trim().length ?? 0) > 0;
    const hasCategory = this.topicId > 0;
    const hasSubcategory = this.subcategory > 0;
    // const hasPrimaryTopic = this.primaryTopic.trim().length > 0;
    const hasPriceTier = this.priceTier.trim().length > 0;
    const hasCourseImage = this.courseImagePreview !== null;
    const hasPromoVideo = this.promoVideoPreview !== null;
    const hasSections = this.sections.length > 0;
    const hasLectures = this.sections.some((section) => section.lectures.length > 0);

    // تحقق من أن جميع المحاضرات لها محتوى
    const allLecturesHaveContent = this.sections.every((section) =>
      section.lectures.every((lecture) => lecture.contentType && lecture.contentType.length > 0)
    );

    // تحقق من أن جميع محاضرات الفيديو لها فيديو
    const allVideoLecturesHaveVideo = this.sections.every((section) =>
      section.lectures.every((lecture) => {
        if (lecture.contentType !== 'Video') {
          return true; // ليس فيديو، فهو صالح
        }
        // إذا كان فيديو، تحقق من وجود الفيديو (File جديد أو URL موجود)
        return lecture.videoUrl !== null && (lecture.videoUrl instanceof File || typeof lecture.videoUrl === 'string');
      })
    );

    return (
      hasTitle &&
      hasSubtitle &&
      hasDescription &&
      hasLevel &&
      hasCategory &&
      hasSubcategory &&
      hasPriceTier &&
      hasCourseImage &&
      hasPromoVideo &&
      hasSections &&
      hasLectures &&
      allLecturesHaveContent &&
      allVideoLecturesHaveVideo
    );
  }




onsubcat(catId:number){
  this.topic.getTopicsBySubCategory(catId).subscribe(data=>{
 this.categories=data
 console.log(data)
 this.cdr.detectChanges()

  })
}
























































// ✅ 15. Helper Method للـ debugging FormData
debugFormData(formData: FormData): void {
  console.log('🔍 Debugging FormData:');
  const entries: any = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      entries[key] = {
        type: 'File',
        name: value.name,
        size: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
        mimeType: value.type
      };
    } else {
      entries[key] = value;
    }
  });

  console.table(entries);
}



  getValidationMessages(): string[] {
    const messages: string[] = [];

    if (this.courseTitle?.trim().length === 0) messages.push('Course title is required');
    if (this.courseSubtitle.trim().length === 0) messages.push('Course subtitle is required');
    if ((this.courseDescription?.trim().length ?? 0) < 200 ) messages.push('Course description must be at least 200 characters');
    if (this.level.trim().length === 0) messages.push('Course level is required');
    if (this.subcategory === 0) messages.push('Course subcategory is required');
    if (this.primaryTopic.trim().length === 0) messages.push('Primary topic is required');
    if (this.priceTier.trim().length === 0) messages.push('Price tier is required');

    if (this.sections.length === 0) {
      messages.push('At least one section is required');
    } else {
      const sectionsWithoutLectures = this.sections.filter(s => s.lectures.length === 0);
      if (sectionsWithoutLectures.length > 0) {
        messages.push('All sections must have at least one lecture');
      }

      const lecturesWithoutContent = this.sections.flatMap(s => s.lectures).filter(l => !l.contentType);
      if (lecturesWithoutContent.length > 0) {
        messages.push('All lectures must have content added');
      }

      const videoLecturesWithoutVideo = this.sections.flatMap(s => s.lectures)
        .filter(l => l.contentType === 'Video' && !l.videoUrl);
      if (videoLecturesWithoutVideo.length > 0) {
        messages.push('All video lectures must have a video file uploaded');
      }
    }

    return messages;
  }
   removeCourseImage(): void {
    this.courseImage = null;
    this.courseImagePreview = null;
  }

  removePromoVideo(): void {
    this.promoVideo = null;
    if (this.promoVideoPreview) {
      URL.revokeObjectURL(this.promoVideoPreview);
      this.promoVideoPreview = null;
    }
  }


  showValidationMessages(): void {
    const messages = this.getValidationMessages();
    if (messages.length > 0) {
      alert('Please complete the following:\n\n' + messages.join('\n'));
    }
  }

 onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.courseImage = file;
      console.log('Image file selected:', file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.courseImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.promoVideo = file;
      console.log('Promo video file selected:', file.name);

      // Create preview URL
      this.promoVideoPreview = URL.createObjectURL(file);
    }
  }

  onSavePricing(): void {
    console.log('Saving pricing...', { currency: this.currency, priceTier: this.priceTier });

  }

  onCompletePremiumApplication(): void {
    console.log('Completing premium application...');
  }

  dismissCurriculumInfo(): void {
    this.showCurriculumInfo = false;
  }

  dismissNewFeatureInfo(): void {
    this.showNewFeatureInfo = false;
  }

  addSection(): void {
    this.newSectionTitle = '';
    this.newSectionObjective = '';
    this.editingSectionId = null;
    this.showSectionModal = true;
  }

  saveSectionModal(): void {
    if (this.editingSectionId) {
      const section = this.sections.find(s => s.id === this.editingSectionId);
      if (section) {
        section.title = this.newSectionTitle;
      }
    } else {
      const newSection = {
        id: this.sections.length + 1,
        title: this.newSectionTitle,
        expanded: false,
        orderIndex: this.sections.length,

        lectures: []
      };
      this.sections.push(newSection);
    }
    this.closeSectionModal();
  }

  closeSectionModal(): void {
    this.showSectionModal = false;
    this.newSectionTitle = '';
    this.newSectionObjective = '';
    this.editingSectionId = null;
  }

  editSection(sectionId: number): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      this.newSectionTitle = section.title;
      this.editingSectionId = sectionId;
      this.showSectionModal = true;
    }
  }

  deleteSection(sectionId: number): void {
    if (confirm('Are you sure you want to delete this section?')) {
      this.sections = this.sections.filter(s => s.id !== sectionId);
    }
  }

  addCurriculumItem(sectionId: number): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      this.newLectureTitle = `Lecture ${section.lectures.length + 1}`;
      this.editingLecture = { sectionId, lectureId: null };
      this.showLectureModal = true;
    }
  }

  editLecture(sectionId: number, lecture: any): void {
    this.newLectureTitle = lecture.title;
    this.editingLecture = { sectionId, lectureId: lecture.id, lecture };
    this.showLectureModal = true;
  }

  saveLectureModal(): void {
    const section = this.sections.find(s => s.id === this.editingLecture.sectionId);
    if (section) {
      if (this.editingLecture.lectureId) {
        // Edit existing lecture
        const lecture = section.lectures.find(l => l.id === this.editingLecture.lectureId);
        if (lecture) {
          lecture.title = this.newLectureTitle;

        }
      } else {
        // Add new lecture
        const newLecture = {
          id: section.lectures.length + 1,
          title: this.newLectureTitle,
          type: 'lecture',
            orderIndex: section.lectures.length,

          contentType: '',
          videoUrl: null
        };
        section.lectures.push(newLecture);
      }
    }
    this.closeLectureModal();
  }

  closeLectureModal(): void {
    this.showLectureModal = false;
    this.newLectureTitle = '';
    this.editingLecture = null;
  }

  deleteLecture(sectionId: number, lectureId: number): void {
    if (confirm('Are you sure you want to delete this lecture?')) {
      const section = this.sections.find(s => s.id === sectionId);
      if (section) {
        section.lectures = section.lectures.filter(l => l.id !== lectureId);
      }
    }
  }

  addContent(section: any, lecture: any): void {
    this.selectedLecture = { section, lecture };
    this.showContentModal = true;
  }

  selectContentType(type: string): void {
    if (this.selectedLecture) {
      this.selectedLecture.lecture.contentType = type;
      this.showContentModal = false;

      if (type === 'Video') {
        this.showVideoUploadModal = true;
      }
    }
  }

  onVideoFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.videoFileName = file.name;
    }
  }

  uploadVideo(): void {
    if (this.videoFile && this.selectedLecture) {
      // Save video file to the lecture
this.selectedLecture.lecture.videoUrl = this.videoFile;

      console.log('Video uploaded successfully:', {
        fileName: this.videoFile.name,
        fileSize: this.videoFile.size,
        section: this.selectedLecture.section.title,
        lecture: this.selectedLecture.lecture.title
      });

      // Display all sections with their videos for verification
      console.log('All sections with videos:', this.sections);

      alert(`Video "${this.videoFileName}" uploaded successfully to lecture "${this.selectedLecture.lecture.title}"!`);
      this.closeVideoUploadModal();

      this.onCourseDataChange();
      this.cdr.detectChanges()
    }
  }

  closeVideoUploadModal(): void {
    this.showVideoUploadModal = false;
    this.videoFile = null;
    this.videoFileName = 'No file selected';
    this.selectedLecture = null;
  }

  closeContentModal(): void {
    this.showContentModal = false;
    this.selectedLecture = null;
  }

  toggleSection(sectionId: number): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }

///////////////////////////////Update Course//////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

 ///////////////////////edit/
  // ✅ 3. حفظ الداتا الأصلية
  saveOriginalData(): void {
    this.originalCourseData = {
      courseTitle: this.courseTitle,
      courseDescription: this.courseDescription,
      courseSubtitle: this.courseSubtitle,
      categoryId: this.category,
      subcategoryId: this.subcategory,
      topicId:this.topicId,
      language: this.language,
      level: this.level,
      primaryTopic: this.primaryTopic,
      priceTier: this.priceTier,
      courseImagePreview: this.courseImagePreview,
      promoVideoPreview: this.promoVideoPreview,
      sections: JSON.parse(JSON.stringify(this.sections)) // deep copy
    };
  }
  startChangeTracking(): void {
    // استخدم setTimeout عشان نتجنب الـ ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.hasUnsavedChanges = false;
    }, 0);
  }
  checkForChanges(): void {
    if (!this.originalCourseData) {
      this.hasUnsavedChanges = false;
      return;
    }

    const hasChanges =
      this.courseTitle !== this.originalCourseData.courseTitle ||
      this.courseDescription !== this.originalCourseData.courseDescription ||
      this.courseSubtitle !== this.originalCourseData.courseSubtitle ||
      this.category !== this.originalCourseData.category ||
      this.subcategory !== this.originalCourseData.subcategory ||
      this.language !== this.originalCourseData.language ||
      this.level !== this.originalCourseData.level ||
      this.primaryTopic !== this.originalCourseData.primaryTopic ||
      this.priceTier !== this.originalCourseData.priceTier ||
      this.courseImage !== null || // صورة جديدة
      this.promoVideo !== null || // فيديو جديد
      JSON.stringify(this.sections) !== JSON.stringify(this.originalCourseData.sections);

 const hasSectionsChanges = this.checkSectionsChanges();

  this.hasUnsavedChanges = hasChanges || hasSectionsChanges;

    if (hasChanges) {
      console.log('⚠️ Unsaved changes detected');
    }
  }

private checkSectionsChanges(): boolean {
  const original = this.originalCourseData.sections;
  const current = this.sections;

  // Check if number of sections changed
  if (original.length !== current.length) {
    return true;
  }

  // Check each section
  for (let i = 0; i < original.length; i++) {
    const origSection = original[i];
    const currSection = current[i];

    // Check section title
    if (origSection.title !== currSection.title) {
      return true;
    }

    // Check number of lectures
    if (origSection.lectures.length !== currSection.lectures.length) {
      return true;
    }

    // Check each lecture
    for (let j = 0; j < origSection.lectures.length; j++) {
      const origLecture = origSection.lectures[j];
      const currLecture = currSection.lectures[j];

      if (
        origLecture.title !== currLecture.title ||
        origLecture.contentType !== currLecture.contentType ||
        origLecture.orderIndex !== currLecture.orderIndex
      ) {
        return true;
      }

      // Check if video changed (new file or removed)
      const hadVideo = origLecture.videoUrl !== null;
      const hasVideo = currLecture.videoUrl !== null;

      if (hadVideo !== hasVideo) {
        return true;
      }

      // If both have videos, check if it's a new file (File object instead of URL string)
      if (hasVideo && currLecture.videoUrl instanceof File) {
        return true;
      }
    }
  }

  return false;
}






  // ✅ 6. استدعي checkForChanges() عند أي تغيير
  onCourseDataChange(): void {
    this.checkForChanges();
  }

  // ✅ 7. Method الـ Save الجديدة
  onSave(): void {
    if (!this.hasUnsavedChanges) {
      console.log('No changes to save');
      return;
    }

    if (!this.courseId) {
      console.error('No course ID');
      alert('Cannot save: Course ID is missing');
      return;
    }

    this.isSaving = true;

    // إنشاء FormData
    const formData = new FormData();

    // Course Basic Info
    formData.append('Id', this.courseId.toString());
    formData.append('Title', this.courseTitle ?? '');
    formData.append('ShortTitle', this.courseSubtitle);
    formData.append('TopicId',this.topicId.toString())
    formData.append('CategoryId', this.category.toString());
    formData.append('SubcategoryId', this.subcategory.toString());
    formData.append('Level', this.level);
    formData.append('Language', this.language);
    formData.append('Description', this.courseDescription ?? '');
    formData.append('ApprovalStatus',this.approvalStatus)

    // Primary Topic
    if (this.primaryTopic) {
      formData.append('PrimaryTopic', this.primaryTopic);
    }

    // Price
    if (this.priceTier === 'Free') {
      formData.append('Price', '0');
    } else {
      const priceString = this.priceTier.replace('$', '').trim();
      formData.append('Price', priceString);
    }

    // Thumbnail (لو اتغيرت)
    if (this.courseImage && this.courseImage instanceof File) {
      formData.append('Thumbnail', this.courseImage, this.courseImage.name);
    }

    // Preview Video (لو اتغير)
    if (this.promoVideo && this.promoVideo instanceof File) {
      formData.append('PreviewVideo', this.promoVideo, this.promoVideo.name);
    }

    // Sections & Lectures
    this.sections.forEach((section, i) => {
      formData.append(`Sections[${i}].Id`, section.id?.toString() || '0');
      formData.append(`Sections[${i}].Title`, section.title);

      section.lectures.forEach((lecture, j) => {
        formData.append(`Sections[${i}].Lectures[${j}].Id`, lecture.id?.toString() || '0');
        formData.append(`Sections[${i}].Lectures[${j}].Title`, lecture.title);

        if (lecture.contentType) {
          formData.append(`Sections[${i}].Lectures[${j}].ContentType`, lecture.contentType);
        }

        if (lecture.videoUrl && lecture.videoUrl instanceof File) {
          formData.append(
            `Sections[${i}].Lectures[${j}].Video`,
            lecture.videoUrl,
            lecture.videoUrl.name
          );
        }
      });
    });

    console.log('💾 Saving course changes...');

    //  استدعي update endpoint
    this.courseService.updateInstructorCourse(this.courseId, formData).subscribe({
      next: (response) => {
        console.log(' Course saved successfully!', response);
        this.isSaving = false;
        this.hasUnsavedChanges = false;

        //  حدّث الداتا الأصلية
        this.saveOriginalData();
        this.cdr.detectChanges()

        // عرض رسالة نجاح
        alert('Course saved successfully! ');
        this.router.navigateByUrl('dashboard/courses')
      },
      error: (error) => {
        console.error('❌ Error saving course:', error);
        this.isSaving = false;

        let errorMessage = 'Failed to save course. ';
        if (error.error?.message) {
          errorMessage += error.error.message;
        } else {
          errorMessage += 'Please try again.';
        }

        alert(errorMessage);
      }
    });
  }
//  8. CanDeactivate Guard - منع المغادرة بدون حفظ
  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm(
        '⚠️ You have unsaved changes!\n\n' +
        'If you leave now, your changes will be lost.\n\n' +
        'Do you want to leave without saving?'
      );
    }
    return true;
  }

  //  9. HostListener للتحذير عند إغلاق الصفحة
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges) {
      $event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  }

  //  10. عند الضغط على "Back to courses"
  onBackToCourses(): void {
    if (this.canDeactivate()) {
      this.router.navigate(['/dashboard/courses']);
    }
  }

}
interface SidebarItem {
 name: string;
  completed: boolean;
  active?: boolean;
  page?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}
