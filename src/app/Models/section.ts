import { Lecture } from "./lecture"

export interface Section {
  id:number,
  title:string
  orderIndex:number
  lectures:Lecture[]
  expanded:boolean

}
