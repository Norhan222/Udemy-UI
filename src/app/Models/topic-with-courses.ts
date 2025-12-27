import { ICourse } from "./icourse";

export interface TopicWithCourses {
  id: number,
  name: string,
  description: string,
  subCategoryId: number,
  subCategoryName:string,
  categoryName: string,
  totalCourses: number,
  publishedCourses: number,
  courses: ICourse[]
}

