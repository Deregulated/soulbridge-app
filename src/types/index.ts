// src/types/index.ts
export type UserRole = 'client' | 'psychiatrist';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Profile extends User {
  role: UserRole;
}

export interface Appointment {
  id: string;
  client_id: string;
  psychiatrist_id: string;
  scheduled_for: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  session_type: 'video' | 'audio' | 'chat';
  notes?: string;
  created_at: string;
  clients: User;
  psychiatrists: User;
}

export interface Session {
  id: string;
  appointment_id: string;
  started_at?: string;
  ended_at?: string;
  status: 'scheduled' | 'live' | 'ended';
  room_id?: string;
}

export interface Assessment {
  id: string;
  psychiatrist_id: string;
  client_id: string;
  title: string;
  questions: Question[];
  responses?: AssessmentResponse[];
  created_at: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'scale';
  options?: string[];
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  client_id: string;
  answers: Answer[];
  submitted_at: string;
}

export interface Answer {
  question_id: string;
  answer: string | number;
}