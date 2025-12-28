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
    rating: number,
    topicName: string,
    instructorName: string,
    sections:Section[]


}
