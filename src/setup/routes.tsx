import { Route, Routes, Navigate } from 'react-router-dom';
import { useSetupState } from './hooks/useSetupState';
import Welcome from './pages/Welcome';
import StoreSetup from './pages/StoreSetup';
import AdminSetup from './pages/AdminSetup';
import DatabaseSetup from './pages/DatabaseSetup';
import Complete from './pages/Complete';

export const SetupRoutes = () => {
  const { isSetupComplete, currentStep } = useSetupState();

  if (isSetupComplete) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/store" element={<StoreSetup />} />
      <Route path="/admin" element={<AdminSetup />} />
      <Route path="/database" element={<DatabaseSetup />} />
      <Route path="/complete" element={<Complete />} />
      <Route path="*" element={<Navigate to={`/setup/${currentStep}`} replace />} />
    </Routes>
  );
};
