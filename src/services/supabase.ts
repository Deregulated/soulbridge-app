// src/services/supabase.ts
import { Appointment } from '@/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth service
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User> & { role: UserRole }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
        }
      }
    });

    if (error) throw error;
    
    // Add user role
    if (data.user) {
      await supabase
        .from('user_roles')
        .insert([{ user_id: data.user.id, role: userData.role }]);
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Appointment service
export const appointmentService = {
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'clients' | 'psychiatrists'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select(`
        *,
        clients:client_id(*),
        psychiatrists:psychiatrist_id(*)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async getClientAppointments(clientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        psychiatrists:psychiatrist_id(*)
      `)
      .eq('client_id', clientId)
      .order('scheduled_for', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getPsychiatristAppointments(psychiatristId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients:client_id(*)
      `)
      .eq('psychiatrist_id', psychiatristId)
      .order('scheduled_for', { ascending: true });
    if (error) throw error;
    return data;
  }
};