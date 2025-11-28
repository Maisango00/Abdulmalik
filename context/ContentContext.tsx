import React, { createContext, useContext, useState } from 'react';
import { Application } from '../types';
import { RECENT_APPLICATIONS } from '../constants';

export interface Post {
  id: string;
  title: string;
  category: 'News' | 'Announcement' | 'Event' | 'Blog';
  date: string;
  content: string;
  image?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'tel' | 'textarea';
  required: boolean;
  options?: string[]; // Array of strings for select options
}

export interface AdmissionSettings {
  fee: number;
  template: {
    schoolName: string;
    address: string;
    logo: string;
    body: string;
  };
  formFields: FormField[];
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  about: {
    title: string;
    description: string;
  };
  posts: Post[];
  admissionSettings: AdmissionSettings;
  applications: Application[];
}

interface ContentContextType {
  content: SiteContent;
  updateHero: (data: Partial<SiteContent['hero']>) => void;
  updateAbout: (data: Partial<SiteContent['about']>) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  updateAdmissionSettings: (settings: Partial<AdmissionSettings>) => void;
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
}

const defaultContent: SiteContent = {
  hero: {
    title: "Excellence in Hifz & Islamic Education",
    subtitle: "Nurturing hearts with the Quran and minds with knowledge. Join Madrasatu Umar Bn Khaddab for a holistic Islamic upbringing.",
    ctaText: "Apply Now"
  },
  about: {
    title: "Why Choose Us?",
    description: "We combine traditional Islamic teaching methods with modern educational standards to produce well-rounded individuals."
  },
  posts: [
    {
      id: '1',
      title: 'Admissions Open for 2024/2025 Session',
      category: 'Announcement',
      date: '2024-05-20',
      content: 'We are pleased to announce that admission forms for the new academic session are now available.',
      image: 'https://picsum.photos/400/250?random=10'
    },
    {
      id: '2',
      title: 'Annual Quran Competition Winners',
      category: 'News',
      date: '2024-05-15',
      content: 'Congratulations to our students who took 1st place in the state-level Hifz competition.',
      image: 'https://picsum.photos/400/250?random=11'
    }
  ],
  admissionSettings: {
    fee: 5000,
    template: {
      schoolName: "Madrasatu Umar Bn Khaddab",
      address: "123 Quranic Avenue, Islamic District, City, State",
      logo: "https://via.placeholder.com/100",
      body: "Dear {applicant_name},\n\nWe are pleased to inform you that you have been offered provisional admission into the {program} program at our institution.\n\nPlease proceed to the portal to complete your registration and pay the necessary acceptance fees.\n\nSincerely,\nRegistrar"
    },
    formFields: [
      { id: 'f1', label: 'First Name', type: 'text', required: true },
      { id: 'f2', label: 'Last Name', type: 'text', required: true },
      { id: 'f3', label: 'Date of Birth', type: 'date', required: true },
      { id: 'f4', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female'] },
      { id: 'f5', label: 'Parent Full Name', type: 'text', required: true },
      { id: 'f6', label: 'Phone Number', type: 'tel', required: true },
      { id: 'f7', label: 'Program Choice', type: 'select', required: true, options: ['Full-time Hifz', 'Weekend School', 'Islamiyyah'] }
    ]
  },
  applications: RECENT_APPLICATIONS
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const updateHero = (data: Partial<SiteContent['hero']>) => {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, ...data } }));
  };

  const updateAbout = (data: Partial<SiteContent['about']>) => {
    setContent(prev => ({ ...prev, about: { ...prev.about, ...data } }));
  };

  const addPost = (postData: Omit<Post, 'id'>) => {
    const newPost: Post = { ...postData, id: Date.now().toString() };
    setContent(prev => ({ ...prev, posts: [newPost, ...prev.posts] }));
  };

  const updatePost = (id: string, postData: Partial<Post>) => {
    setContent(prev => ({
      ...prev,
      posts: prev.posts.map(post => post.id === id ? { ...post, ...postData } : post)
    }));
  };

  const deletePost = (id: string) => {
    setContent(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== id)
    }));
  };

  const updateAdmissionSettings = (settings: Partial<AdmissionSettings>) => {
    setContent(prev => ({
      ...prev,
      admissionSettings: { ...prev.admissionSettings, ...settings }
    }));
  };

  const addApplication = (app: Application) => {
    setContent(prev => ({
      ...prev,
      applications: [app, ...prev.applications]
    }));
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setContent(prev => ({
      ...prev,
      applications: prev.applications.map(app => 
        app.id === id ? { ...app, status } : app
      )
    }));
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateHero, 
      updateAbout, 
      addPost, 
      updatePost, 
      deletePost,
      updateAdmissionSettings,
      addApplication,
      updateApplicationStatus
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
