import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../../store/AuthContext';

interface Session {
  id: string;
  deviceInfo: {
    type: string;
    os: string;
    browser: string;
  };
  ipAddress: string;
  location: {
    city: string;
    country: string;
  };
  lastActive: Date;
  current: boolean;
}

export const ActiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminUser } = useAuth();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      // TODO: Replace with actual API call
      const mockSessions: Session[] = [
        {
          id: '1',
          deviceInfo: {
            type: 'desktop',
            os: 'Windows 11',
            browser: 'Chrome 121'
          },
          ipAddress: '192.168.1.1',
          location: {
            city: 'San Francisco',
            country: 'United States'
          },
          lastActive: new Date(),
          current: true
        },
        // Add more mock sessions as needed
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // TODO: Implement session revocation
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      // TODO: Implement all sessions revocation
      setSessions(prev => prev.filter(session => session.current));
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Active Sessions</h2>
        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAllSessions}
            className="text-sm text-red-600 hover:text-red-500"
          >
            Sign out all other sessions
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {session.deviceInfo.type === 'desktop' ? (
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {session.deviceInfo.browser} on {session.deviceInfo.os}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Current session
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {session.location.city}, {session.location.country} • {session.ipAddress}
                </div>
                <div className="text-sm text-gray-500">
                  Last active {format(new Date(session.lastActive), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            </div>
            {!session.current && (
              <button
                onClick={() => handleRevokeSession(session.id)}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Sign out
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
