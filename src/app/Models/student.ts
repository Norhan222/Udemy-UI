import { StudentCourse } from './student-course';
export interface Student {
  id: number;
  name: string;
  email: string;
  profileImageUrl:string
  enrolledCourses: StudentCourse[];
  country: string;
  totalWatchTime: string;
}
