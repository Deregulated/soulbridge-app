// src/services/paymentService.ts
import { supabase } from '@/integrations/supabase/client';

export const paymentService = {
  async createCheckoutSession(appointmentId: string, amount: number) {
    const { data: session, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { appointmentId, amount }
    });

    if (error) throw error;

    // Redirect to Stripe checkout
    if (session.url) {
      window.location.href = session.url;
    }
  },

  async handlePaymentSuccess(sessionId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed', payment_status: 'paid' })
      .eq('stripe_session_id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
