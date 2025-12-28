import { StudentCourse } from './student-course';
export interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: StudentCourse[];
  country: string;
  totalWatchTime: string;
}
