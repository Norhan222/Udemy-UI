export interface LoginResponse {
    jwtToken:string
    refreshToken:string
    user:{
  id:string
  firstName:string
  lastName:string
  email:string
  profileImageUrl:string
  role:string
    }
}
