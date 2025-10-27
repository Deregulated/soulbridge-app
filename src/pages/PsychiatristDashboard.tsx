// src/pages/PsychiatristDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService, sessionService, assessmentService } from '../services/supabase';
import { Appointment, Session, Assessment } from '../types';
import { Calendar, Users, FileText, Video, Bell } from 'lucide-react';

export const PsychiatristDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      subscribeToRealtime();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [apptsData, sessionsData, assessmentsData] = await Promise.all([
        appointmentService.getPsychiatristAppointments(user!.id),
        sessionService.getActiveSessions(user!.id),
        assessmentService.getPsychiatristAssessments(user!.id)
      ]);
      setAppointments(apptsData);
      setActiveSessions(sessionsData);
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    // Subscribe to session changes
    const subscription = sessionService.subscribeToSessions(user!.id, (session) => {
      if (session.status === 'live') {
        setActiveSessions(prev => [...prev, session]);
      } else if (session.status === 'ended') {
        setActiveSessions(prev => prev.filter(s => s.id !== session.id));
      }
    });

    return () => subscription.unsubscribe();
  };

  const startSession = async (appointmentId: string) => {
    try {
      const session = await sessionService.startSession(appointmentId);
      setActiveSessions(prev => [...prev, session]);
      
      // Send notification to client
      await sessionService.notifySessionStart(appointmentId);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'created_at'>) => {
    try {
      const newAssessment = await assessmentService.createAssessment({
        ...assessmentData,
        psychiatrist_id: user!.id
      });
      setAssessments(prev => [...prev, newAssessment]);
      setShowCreateAssessment(false);
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, Dr. {profile?.last_name}!
            </h1>
            <div className="flex space-x-4">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
                <Bell className="w-5 h-5 inline mr-2" />
                Notifications
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSessions.map(session => (
                <div key={session.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Live Session</h3>
                      <p className="text-green-600">In progress</p>
                    </div>
                    <Video className="w-8 h-8 text-green-600" />
                  </div>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    Join Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Appointments
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {appointment.clients.first_name} {appointment.clients.last_name}
                          </h3>
                          <p className="text-gray-500">
                            {new Date(appointment.scheduled_for).toLocaleString()}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => startSession(appointment.id)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                        >
                          Start Session
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessments & Quick Actions */}
          <div className="space-y-6">
            {/* Assessments */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Assessments
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {assessments.map(assessment => (
                    <div key={assessment.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                      <button className="mt-2 text-teal-600 hover:text-teal-700 text-sm font-medium">
                        View Responses
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowCreateAssessment(true)}
                  className="w-full mt-4 bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700"
                >
                  Create New Assessment
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Today</span>
                  <span className="font-semibold">
                    {appointments.filter(a => 
                      new Date(a.scheduled_for).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-semibold text-green-600">{activeSessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Assessments</span>
                  <span className="font-semibold text-yellow-600">{assessments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Assessment Modal */}
      {showCreateAssessment && (
        <CreateAssessmentModal 
          onSubmit={createAssessment}
          onClose={() => setShowCreateAssessment(false)}
        />
      )}
    </div>
  );
};