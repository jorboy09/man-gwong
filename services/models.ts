export interface User{
    id:number,
    email:string,
    password?:string
    username:string
    userIcon:string,
    admin: number,
    created_at:string
    

}

export interface GoogleUser{
    id:number,
    email:string,
    username:string,
    userIcon:string,
    admin: number,
    created_at:string
}


export interface ReportedPost{
    post_id:number,
    content:string

}

export interface ReportedComment{
    comment_type_id:number,
    content:string

}