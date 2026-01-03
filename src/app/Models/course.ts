import { Section } from "./section";

export class Course {
  title!: string;
  shortTitle!: string;
  categoryId!: number;
  subcategoryId!: number;
  tpoicId!:number;
  level!: string;
  description!: string;
  language!: string;
  price!: number;
  Thumbnail!: File;
  PreviewVideo!: File;
  sections!:Section[]

}
