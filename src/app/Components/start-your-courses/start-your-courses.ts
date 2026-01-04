import { ChangeDetectorRef, Component } from '@angular/core';
import { ILecture } from '../../Models/ilecture';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ICourse } from '../../Models/icourse';
import { Subscription } from 'rxjs';
import { CourseService } from '../../Services/course-service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-start-your-courses',
    imports: [Carousel, ButtonModule, TranslateModule],
    templateUrl: './start-your-courses.html',
    styleUrl: './start-your-courses.css',
})
export class StartYourCourses {


    responsiveOptions: any[] | undefined;
    courses!: ICourse[];
    topPickCourse!: ICourse;
    dataResponse!: Subscription;
    cartAdded = false;
    value: number = 3;
    // selectedCourse: any;
    // @ViewChild('op') OP!:OverlayPanel;

    constructor(public courseService: CourseService,
        public cdn: ChangeDetectorRef) { } ///private productService: ProductService) {}

    ngOnInit() {
        this.dataResponse = this.courseService.getStudentCourses().subscribe((data: any) => {
            this.courses = data.data;
            this.topPickCourse = this.courses[0];
            this.cdn.detectChanges();
        })

        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 4,
                numScroll: 1
            },
            {
                breakpoint: '1200px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '992px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '600px',
                numVisible: 1,
                numScroll: 1
            }
        ];



    }

    ngOnDestroy(): void {
        this.dataResponse.unsubscribe(); //end request
    }

}
