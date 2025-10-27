// src/services/paymentService.ts
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const paymentService = {
  async createCheckoutSession(appointmentId: string, amount: number) {
    const { data: session, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { appointmentId, amount }
    });

    if (error) throw error;

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      throw result.error;
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