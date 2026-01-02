export interface Review {
   id: number;
  studentName: string;
  courseTitle: string;
  rating: number;
  comment: string;
  answered: boolean;
  createdDate: string;

}

export interface CorseRevie
{
  courseId: number;
  rating: number;
  comment: string;
}