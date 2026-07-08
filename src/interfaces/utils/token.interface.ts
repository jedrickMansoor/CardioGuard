export interface ITokenPayload {
  user: any;
  role: "patient" | "doctor" | "admin";
}