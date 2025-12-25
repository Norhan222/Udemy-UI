import { Category } from './../../../../Models/category';
import { CourseFormData, StepperService } from './../../../../Services/stepper-service';
import { CommonModule } from '@angular/common';
import { Section } from './../../../../Models/section';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../../Models/course';
import { Title } from '@angular/platform-browser';
import { CourseService } from '../../../../Services/course-service';

@Component({
  selector: 'app-complete-creation-course',
  imports: [CommonModule,FormsModule],
  templateUrl: './complete-creation-course.html',
  styleUrl: './complete-creation-course.css',
})
export class CompleteCreationCourse implements OnInit {

course!:Course;
sectionss:Section[]=[];
courseData!:CourseFormData;
courseTitle='';
courseDescription=''
category='';
constructor(private courseService:CourseService ,private StepperService:StepperService){
  this.course=new Course();
}
  ngOnInit(): void {
    this.courseData=this.StepperService.getFormData();
     this.courseTitle = this.courseData.courseTitle;
        this.courseDescription = this.courseData.description ;
          this.category = this.courseData.category;


  }
   activePage = 'course-landing';

  // Course Landing Page Data
  courseSubtitle = '';
  language = 'English (US)';
  level = '';
  subcategory = '';
  primaryTopic = '';

  // Pricing Page Data
  currency = 'USD';
  priceTier = '';

  // Curriculum Data
  showCurriculumInfo = true;
  showNewFeatureInfo = true;
  showContentModal = false;
  showSectionModal = false;
  showLectureModal = false;
  showVideoUploadModal = false;
    showSuccessModal = false;
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

  sections = [
    {
      id: 1,
      title: 'Introduction',
      expanded: false,
      lectures: [
        { id: 1, title: 'Introduction', type: 'lecture', contentType: '', video: null }
      ]
    }
  ];

  // Editor States
  isBold = false;
  isItalic = false;

  sidebarSections: SidebarSection[] = [

    {
      title: 'Create your content',
      items: [
        { name: 'Film & edit', completed: true, page: 'film-edit' },
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
        { name: 'Promotions', completed: true, page: 'promotions' },
        { name: 'Course messages', completed: false, page: 'messages' }
      ]
    }
  ];

  languages = ['English (US)', 'Arabic', 'Spanish', 'French', 'German'];
  levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  categories = ['Design', 'Development', 'Business', 'Marketing'];
  subcategories = ['Web Design', 'Graphic Design', 'UI/UX', 'Game Design'];
  currencies = ['USD', 'EUR', 'GBP', 'EGP'];
  priceTiers = ['Free', '$19.99', '$29.99', '$49.99', '$99.99', '$199.99'];

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

  onSave(): void {
    console.log('Saving course...', this.activePage);
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

  onSubmitForReview(): void {
    if (!this.canSubmitForReview()) {
      alert('Please complete all required fields before submitting for review.');
      return;
    }
    this.course.title=this.courseTitle
    this.course.description=this.courseDescription
    this.course.language=this.language
    this.course.level=this.level
    this.course.category=this.category
    this.course.subcategory=this.subcategory
   this.course.price=this.priceTier==='Free'?0:parseFloat( this.priceTier.replace('$',''))




    const formData = new FormData();

// course level
formData.append('Title', this.course.title);
formData.append('ShortTitle', this.course.shortTitle);
formData.append('Category', this.course.category);
formData.append('Subcategory', this.course.subcategory);
formData.append('Level', this.course.level);
formData.append('Language', this.course.language);
formData.append('Price', this.course.price.toString());
formData.append('Description', this.course.description);
formData.append('Thumbnail', this.course.Thumbnail);
formData.append('PreviewVideo',this.course.PreviewVideo);

// sections
 this.sections.forEach((section, i) => {
  formData.append(`Sections[${i}].title`, section.title);

 section.lectures.forEach((lecture, j) => {
   formData.append(
     `Sections[${i}].Lectures[${j}].title`,
     lecture.title
   );
   if(lecture.video){
    formData.append(`Sections[${i}].Lectures[${j}].video`, lecture.video)
   }

   });
});
this.courseService.createCourse(formData).subscribe({
  next: (courseId) => {
    console.log('Course created with ID:', courseId);
  },
  error: (error) => {
    console.error('Error creating course:', error);
  }
});



   console.log('Submitting course for review...', this.course);
  }

 canSubmitForReview(): boolean {
    // Check Course Landing Page fields
    const hasTitle = this.courseTitle.trim().length > 0;
    const hasSubtitle = this.courseSubtitle.trim().length > 0;
    const hasDescription = this.courseDescription.trim().length >= 200;
    const hasLevel = this.level.trim().length > 0;
    const hasCategory = this.category.trim().length > 0;
    const hasSubcategory = this.subcategory.trim().length > 0;
    const hasPrimaryTopic = this.primaryTopic.trim().length > 0;

    // Check Pricing
    const hasPriceTier = this.priceTier.trim().length > 0;

    // Check Curriculum - at least one section with one lecture
    const hasSections = this.sections.length > 0;
    const hasLectures = this.sections.some(section => section.lectures.length > 0);
    const allLecturesHaveContent = this.sections.every(section =>
      section.lectures.every(lecture => lecture.contentType && lecture.contentType.length > 0)
    );
    const allVideoLecturesHaveVideo = this.sections.every(section =>
      section.lectures.every(lecture =>
        lecture.contentType !== 'Video' || (lecture.contentType === 'Video' && lecture.video !== null)
      )
    );

    return hasTitle && hasSubtitle && hasDescription && hasLevel &&
           hasCategory && hasSubcategory && hasPrimaryTopic &&
           hasPriceTier && hasSections && hasLectures && allLecturesHaveContent && allVideoLecturesHaveVideo;
  }

  getValidationMessages(): string[] {
    const messages: string[] = [];

    if (this.courseTitle.trim().length === 0) messages.push('Course title is required');
    if (this.courseSubtitle.trim().length === 0) messages.push('Course subtitle is required');
    if (this.courseDescription.trim().length < 200) messages.push('Course description must be at least 200 characters');
    if (this.level.trim().length === 0) messages.push('Course level is required');
    if (this.subcategory.trim().length === 0) messages.push('Course subcategory is required');
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
        .filter(l => l.contentType === 'Video' && !l.video);
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
          contentType: '',
          video: null
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
      this.selectedLecture.lecture.video = this.videoFile;

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
