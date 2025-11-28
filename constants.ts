import { Application, Student, Teacher, UserRole } from './types';

export const MOCK_STUDENT: Student = {
  id: 'S001',
  name: 'Abdullah Ibrahim',
  email: 'abdullah@student.mukl.edu',
  role: UserRole.STUDENT,
  regNumber: 'MUKL/2024/001/H1',
  class: 'Hifz Class 1',
  hifzProgress: 45,
  attendance: 98,
  feesOwed: 15000,
  avatar: 'https://picsum.photos/200/200?random=1'
};

export const MOCK_TEACHER: Teacher = {
  id: 'T001',
  name: 'Ustadh Muhammad Ali',
  email: 'm.ali@mukl.edu',
  role: UserRole.TEACHER,
  employeeId: 'STAFF/045',
  subjects: ['Quran', 'Tajweed'],
  classes: ['Hifz 1', 'Hifz 2'],
  avatar: 'https://picsum.photos/200/200?random=2'
};

export const MOCK_ADMIN = {
  id: 'A001',
  name: 'Admin User',
  email: 'admin@mukl.edu',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/200/200?random=3'
};

export const RECENT_APPLICATIONS: Application[] = [
  { id: 'APP001', applicantName: 'Yusuf Ahmed', status: 'Pending', date: '2024-05-20', program: 'Full Hifz' },
  { id: 'APP002', applicantName: 'Fatima Umar', status: 'Approved', date: '2024-05-19', program: 'Islamic Studies' },
  { id: 'APP003', applicantName: 'Zainab Musa', status: 'Review', date: '2024-05-18', program: 'Full Hifz' },
  { id: 'APP004', applicantName: 'Omar Farouk', status: 'Rejected', date: '2024-05-15', program: 'Weekend School' },
];

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/#gallery' },
  { name: 'Contact', path: '/#contact' },
];

export const PRAYER_TIMES = {
  Fajr: '05:15 AM',
  Dhuhr: '01:30 PM',
  Asr: '04:45 PM',
  Maghrib: '07:10 PM',
  Isha: '08:40 PM',
};