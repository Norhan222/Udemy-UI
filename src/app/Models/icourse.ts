import { SubCategory } from './sub-category';
import { Section } from "./section"

export interface ICourse {
    id: number,
    title: string,
    shortDescription: string
    description: string ,
    price: number,
    level: string,
    approvalStatus : string,
    language: string,
    thumbnailUrl:string,
    previewVideoUrl:string,
    instructorId: string,
    lastUpdatedDate: string,
      categoryId: number,
      subCategoryId: number,
       topicId:number,
    rating: number,
    category:string|null,
    subCategory:string|null,
    primaryTopic:string|null
    topicName: string,
    instructorName: string,
    sections:Section[]


}
