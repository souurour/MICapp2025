import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  contactNumber?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  department?: string;
  contactNumber?: string;
  isActive: boolean;
}
