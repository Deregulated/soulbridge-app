// src/services/sessionService.ts
import { supabase } from '@/integrations/supabase/client';
import { Session } from '../types';

export const sessionService = {
  async startSession(appointmentId: string): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        appointment_id: appointmentId,
        started_at: new Date().toISOString(),
        status: 'live' as const,
        room_id: `room-${appointmentId}-${Date.now()}`
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  },

  async endSession(sessionId: string): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        status: 'ended' as const
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data as any;
  },

  async getActiveSessions(psychiatristId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        appointments!inner(
          psychiatrist_id
        )
      `)
      .eq('appointments.psychiatrist_id', psychiatristId)
      .eq('status', 'live');
    
    if (error) throw error;
    return data as any;
  },

  async notifySessionStart(appointmentId: string): Promise<void> {
    // Get appointment details
    const { data: appointment } = await supabase
      .from('appointments')
      .select('client_id')
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      // Create notification
      await supabase
        .from('notifications')
        .insert([{
          user_id: appointment.client_id,
          title: 'Session Started',
          message: 'Your therapist has started the session. You can join now.',
          type: 'session_start',
          metadata: { appointmentId }
        }]);
    }
  },

  subscribeToSessions(userId: string, callback: (session: Session) => void) {
    const subscription = supabase
      .channel('sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sessions',
          filter: `appointments.psychiatrist_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Session);
        }
      )
      .subscribe();

    return subscription;
  }
};