import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { SystemSettings } from '../admin/types/settings';

const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      support {
        enableLiveChat
        chatProvider
        whatsapp {
          businessNumber
          apiKey
          enableGroupChat
          messageCleanupDelay
        }
        chatSettings {
          operatingHours {
            start
            end
          }
        }
      }
    }
  }
`;

export const useSystemSettings = () => {
  const { data, loading, error, refetch } = useQuery<{ systemSettings: SystemSettings }>(GET_SYSTEM_SETTINGS);

  return {
    settings: data?.systemSettings,
    loading,
    error,
    refetch
  };
};
