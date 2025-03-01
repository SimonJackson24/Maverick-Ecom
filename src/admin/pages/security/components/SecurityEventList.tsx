import React from 'react';
import { format } from 'date-fns';
import { SecurityEvent } from '../../../services/SecurityLogService';

interface SecurityEventListProps {
  events: SecurityEvent[];
  loading: boolean;
  onRefresh: () => void;
}

export const SecurityEventList: React.FC<SecurityEventListProps> = ({
  events,
  loading,
  onRefresh
}) => {
  const getEventIcon = (event: SecurityEvent) => {
    switch (event.eventType) {
      case 'LOGIN_SUCCESS':
        return '🔓';
      case 'LOGIN_FAILURE':
        return '🚫';
      case 'LOGOUT':
        return '🔒';
      case 'PASSWORD_CHANGE':
        return '🔑';
      case 'SETUP_2FA':
        return '🛡️';
      case 'SUSPICIOUS_ACTIVITY':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 h-16 mb-2 rounded-md"
          />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No security events found</p>
        <button
          onClick={onRefresh}
          className="mt-4 text-primary-600 hover:text-primary-500"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Event</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Device</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {events.map((event) => (
            <tr key={event.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">{getEventIcon(event)}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {event.eventType.replace(/_/g, ' ')}
                    </div>
                    <div className="text-gray-500">{event.ipAddress}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm:ss')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {event.location ? (
                  <div>
                    <div>{event.location.city}</div>
                    <div className="text-gray-400">{event.location.country}</div>
                  </div>
                ) : (
                  'Unknown'
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {event.deviceInfo ? (
                  <div>
                    <div>{event.deviceInfo.browser}</div>
                    <div className="text-gray-400">{event.deviceInfo.os}</div>
                  </div>
                ) : (
                  'Unknown'
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
