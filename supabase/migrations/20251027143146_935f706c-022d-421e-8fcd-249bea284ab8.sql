-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  psychiatrist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  session_type TEXT NOT NULL DEFAULT 'video' CHECK (session_type IN ('video', 'audio', 'chat')),
  notes TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychiatrist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create assessment_responses table
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = psychiatrist_id);

CREATE POLICY "Clients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = psychiatrist_id);

-- RLS Policies for sessions
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE appointments.id = sessions.appointment_id
      AND (appointments.client_id = auth.uid() OR appointments.psychiatrist_id = auth.uid())
    )
  );

CREATE POLICY "Psychiatrists can manage sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE appointments.id = sessions.appointment_id
      AND appointments.psychiatrist_id = auth.uid()
    )
  );

-- RLS Policies for assessments
CREATE POLICY "Users can view their own assessments"
  ON public.assessments FOR SELECT
  USING (auth.uid() = psychiatrist_id OR auth.uid() = client_id);

CREATE POLICY "Psychiatrists can create assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (auth.uid() = psychiatrist_id);

CREATE POLICY "Psychiatrists can update their assessments"
  ON public.assessments FOR UPDATE
  USING (auth.uid() = psychiatrist_id);

-- RLS Policies for assessment_responses
CREATE POLICY "Users can view their own responses"
  ON public.assessment_responses FOR SELECT
  USING (
    auth.uid() = client_id OR 
    EXISTS (
      SELECT 1 FROM public.assessments
      WHERE assessments.id = assessment_responses.assessment_id
      AND assessments.psychiatrist_id = auth.uid()
    )
  );

CREATE POLICY "Clients can submit responses"
  ON public.assessment_responses FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_psychiatrist ON public.appointments(psychiatrist_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_for);
CREATE INDEX idx_sessions_appointment ON public.sessions(appointment_id);
CREATE INDEX idx_assessments_psychiatrist ON public.assessments(psychiatrist_id);
CREATE INDEX idx_assessments_client ON public.assessments(client_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
