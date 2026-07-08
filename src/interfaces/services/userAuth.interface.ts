export interface RegisterInput {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  dateOfBirth: Date;
  gender: string;
  address?: string;
  phoneNumber?: string;
  picture?: string | null;
  bio?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
