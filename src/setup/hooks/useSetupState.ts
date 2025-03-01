import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_SETUP_STATE = gql`
  query GetSetupState {
    setupState {
      isSetupComplete
      currentStep
      storeInitialized
      adminCreated
    }
  }
`;

const UPDATE_SETUP_STATE = gql`
  mutation UpdateSetupState($input: UpdateSetupStateInput!) {
    updateSetupState(input: $input) {
      isSetupComplete
      currentStep
      storeInitialized
      adminCreated
    }
  }
`;

export const useSetupState = () => {
  const { data, loading, error } = useQuery(GET_SETUP_STATE);
  const [updateSetupState] = useMutation(UPDATE_SETUP_STATE);

  const setCurrentStep = async (step: string) => {
    await updateSetupState({
      variables: {
        input: {
          currentStep: step,
        },
      },
    });
  };

  const completeSetup = async () => {
    await updateSetupState({
      variables: {
        input: {
          isSetupComplete: true,
          setupCompletedAt: new Date().toISOString(),
        },
      },
    });
  };

  return {
    isSetupComplete: data?.setupState?.isSetupComplete ?? false,
    currentStep: data?.setupState?.currentStep ?? 'welcome',
    storeInitialized: data?.setupState?.storeInitialized ?? false,
    adminCreated: data?.setupState?.adminCreated ?? false,
    loading,
    error,
    setCurrentStep,
    completeSetup,
  };
};
