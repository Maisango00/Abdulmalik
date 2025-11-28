export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  regNumber: string;
  class: string;
  hifzProgress: number; // Percentage
  attendance: number;
  feesOwed: number;
}

export interface Teacher extends User {
  employeeId: string;
  subjects: string[];
  classes: string[];
}

export interface Application {
  id: string;
  applicantName: string;
  status: 'Pending' | 'Review' | 'Approved' | 'Rejected';
  date: string;
  program: string;
  formData?: Record<string, any>;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}