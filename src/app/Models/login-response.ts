export interface LoginResponse {
    jwtToken:string
    user:{
  id:string
  firstName:string
  lastName:string
  email:string
  profileImageUrl:string
  role:string
    }
}
