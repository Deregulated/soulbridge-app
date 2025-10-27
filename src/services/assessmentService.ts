// src/services/assessmentService.ts
import { supabase } from '@/integrations/supabase/client';
import { Assessment, AssessmentResponse } from '../types';

export const assessmentService = {
  async createAssessment(assessmentData: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .insert([{
        ...assessmentData,
        questions: assessmentData.questions as any
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  },

  async getPsychiatristAssessments(psychiatristId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('psychiatrist_id', psychiatristId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as any;
  },

  async getClientAssessments(clientId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as any;
  },

  async submitResponse(responseData: Omit<AssessmentResponse, 'id' | 'submitted_at'>): Promise<AssessmentResponse> {
    const { data, error } = await supabase
      .from('assessment_responses')
      .insert([{
        ...responseData,
        answers: responseData.answers as any,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  }
};