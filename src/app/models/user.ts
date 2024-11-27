export interface User {
    _id? : any;
    userId?: any;
    userName: any; // Change from name to userName
    email: any,
    password: any,
    role: string;
    active: boolean
  }