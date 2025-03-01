import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../store/AuthContext';

interface BackupCode {
  code: string;
  used: boolean;
}

export const Setup2FAPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const setup = async () => {
      try {
        const qrCodeData = await authService.setup2FA();
        setQrCode(qrCodeData);
      } catch (err: any) {
        setError(err.message || 'Failed to setup 2FA');
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const isValid = await authService.verify2FA(verificationCode);
      
      if (isValid) {
        // Generate backup codes
        const codes = Array.from({ length: 10 }, () => ({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          used: false
        }));
        setBackupCodes(codes);
        setStep('backup');
        await refreshUser();
      } else {
        setError('Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/admin/security');
  };

  if (loading && step === 'qr') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 'qr' && 'Set up two-factor authentication'}
          {step === 'verify' && 'Verify your device'}
          {step === 'backup' && 'Save your backup codes'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {step === 'qr' && (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Scan this QR code with your authenticator app (such as Google Authenticator or Authy).
              </p>

              <div className="flex justify-center mb-6">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Next
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app to verify setup.
              </p>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) {
                    setVerificationCode(value);
                  }
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center tracking-widest"
                placeholder="000000"
                maxLength={6}
              />

              <button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  (loading || verificationCode.length !== 6) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Verify
              </button>
            </div>
          )}

          {step === 'backup' && (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
              </p>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-sm bg-white p-2 rounded border border-gray-200 text-center"
                    >
                      {code.code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    const codes = backupCodes.map(c => c.code).join('\n');
                    const blob = new Blob([codes], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'backup-codes.txt';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Download codes
                </button>

                <button
                  onClick={handleComplete}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  I've saved my backup codes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
