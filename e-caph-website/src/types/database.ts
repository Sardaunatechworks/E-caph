export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  icon_name: string | null;
  featured_image: string | null;
  color_theme: string | null;
  outcomes: Json | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  programme_id: string | null;
  title: string;
  slug: string;
  category?: string;
  summary: string;
  description: string | null;
  objectives: string[] | null;
  activities: string[] | null;
  results_to_date: string[] | null;
  target_beneficiaries: string | null;
  location: string | null;
  donor_partner: string | null;
  status: 'planned' | 'ongoing' | 'completed' | 'suspended';
  start_date: string | null;
  end_date: string | null;
  featured_image: string | null;
  is_flagship: boolean;
  is_published: boolean;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string | null;
  category_id: string | null;
  programme_id: string | null;
  project_id: string | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string | null;
  post_type: 'article' | 'news' | 'impact_story' | 'announcement' | 'press_release' | 'report' | 'field_update';
  status: 'draft' | 'under_review' | 'published' | 'archived';
  published_at: string | null;
  views_count?: number;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  role_title: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  opportunity_type: string;
  location: string | null;
  description: string;
  requirements: string | null;
  application_link: string | null;
  deadline: string | null;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  inquiry_type: string;
  subject: string;
  message: string;
  consent?: boolean;
  is_read?: boolean;
  status?: string;
  replied_at: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface ImpactStatistic {
  id: string;
  label: string;
  value: number;
  numeric_value?: number;
  suffix: string | null;
  icon_name: string | null;
  category: string | null;
  order_index: number;
  is_published: boolean;
  updated_at?: string;
}
