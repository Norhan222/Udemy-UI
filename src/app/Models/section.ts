import { Lecture } from "./lecture"

export interface Section {
  id:number,
  title:string
  lectures:Lecture[]
    expanded:boolean

}
