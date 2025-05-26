export type UserStatus = "active" | "inactive" | "pending" | "suspended";
export type UserRole = "Admin" | "Editor" | "User" | "Guest";

export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  isEmailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
}
export interface UsersTableProps {
  users: User[];
//   onDelete: (id: number) => void;
  primaryColor?: string;
}