import React, { useState } from 'react';
import { emailTemplateVariations } from '../../../services/email/EmailTemplateVariations';

interface EmailPreviewProps {
  templateId: string;
  content: string;
  previewData?: {
    desktop: boolean;
    showVariables: boolean;
    testData?: boolean;
  };
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  templateId,
  content,
  previewData = { desktop: true, showVariables: false, testData: true }
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'plain'>(
    previewData.desktop ? 'desktop' : 'mobile'
  );
  const [previewMode, setPreviewMode] = useState<'rendered' | 'code'>('rendered');

  const testUserData = {
    firstName: 'Alex',
    lastName: 'Smith',
    email: 'alex.smith@example.com',
    scentPreferences: {
      notes: ['Vanilla', 'Sandalwood', 'Lavender'],
      intensity: 'MODERATE',
      mood: 'RELAXING',
      season: 'FALL'
    },
    lastPurchase: {
      productId: 'candle-123',
      name: 'Autumn Breeze Candle',
      price: 24.99,
      purchaseDate: '2025-01-15'
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview Controls */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'desktop'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setViewMode('desktop')}
              >
                <DeviceDesktopIcon className="w-5 h-5" />
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'mobile'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setViewMode('mobile')}
              >
                <DeviceMobileIcon className="w-5 h-5" />
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'plain'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setViewMode('plain')}
              >
                <DocumentTextIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md ${
                  previewMode === 'rendered'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setPreviewMode('rendered')}
              >
                Preview
              </button>
              <button
                className={`px-3 py-1 rounded-md ${
                  previewMode === 'code'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setPreviewMode('code')}
              >
                HTML
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {/* Implement send test email */}}
            >
              Send Test
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div
          className={`mx-auto bg-white shadow-lg ${
            getPreviewWidth(viewMode)
          }`}
        >
          {previewMode === 'rendered' ? (
            <div className="p-4">
              <PreviewFrame
                content={content}
                viewMode={viewMode}
                userData={previewData.testData ? testUserData : undefined}
              />
            </div>
          ) : (
            <pre className="p-4 font-mono text-sm overflow-auto">
              {content}
            </pre>
          )}
        </div>
      </div>

      {/* Variable Inspector */}
      {previewData.showVariables && (
        <div className="border-t bg-white p-4">
          <h3 className="text-sm font-medium mb-2">Template Variables</h3>
          <div className="grid grid-cols-3 gap-4">
            <VariableInspector
              label="User Data"
              variables={[
                '{{firstName}}',
                '{{lastName}}',
                '{{email}}'
              ]}
            />
            <VariableInspector
              label="Scent Profile"
              variables={[
                '{{scentProfile.notes}}',
                '{{scentProfile.intensity}}',
                '{{scentProfile.mood}}'
              ]}
            />
            <VariableInspector
              label="Dynamic Content"
              variables={[
                '{{recommendations}}',
                '{{seasonalContent}}',
                '{{socialProof}}'
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface PreviewFrameProps {
  content: string;
  viewMode: 'desktop' | 'mobile' | 'plain';
  userData?: any;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  content,
  viewMode,
  userData
}) => {
  const processedContent = processContent(content, userData);

  return (
    <iframe
      srcDoc={processedContent}
      className={`w-full ${
        viewMode === 'mobile' ? 'h-[667px]' : 'h-[800px]'
      }`}
      title="Email Preview"
    />
  );
};

interface VariableInspectorProps {
  label: string;
  variables: string[];
}

const VariableInspector: React.FC<VariableInspectorProps> = ({
  label,
  variables
}) => (
  <div>
    <h4 className="text-xs font-medium text-gray-500 mb-1">{label}</h4>
    <div className="space-y-1">
      {variables.map((variable) => (
        <div
          key={variable}
          className="text-xs bg-gray-100 p-1 rounded font-mono"
        >
          {variable}
        </div>
      ))}
    </div>
  </div>
);

// Helper functions
const getPreviewWidth = (viewMode: 'desktop' | 'mobile' | 'plain') => {
  switch (viewMode) {
    case 'mobile':
      return 'max-w-sm';
    case 'desktop':
      return 'max-w-4xl';
    case 'plain':
      return 'max-w-3xl';
  }
};

const processContent = (content: string, userData?: any): string => {
  if (!userData) return content;

  let processed = content;
  // Replace user variables
  processed = processed.replace(/{{firstName}}/g, userData.firstName);
  processed = processed.replace(/{{lastName}}/g, userData.lastName);
  processed = processed.replace(/{{email}}/g, userData.email);

  // Replace scent profile variables
  if (userData.scentPreferences) {
    processed = processed.replace(
      /{{scentProfile\.notes}}/g,
      userData.scentPreferences.notes.join(', ')
    );
    processed = processed.replace(
      /{{scentProfile\.intensity}}/g,
      userData.scentPreferences.intensity
    );
    processed = processed.replace(
      /{{scentProfile\.mood}}/g,
      userData.scentPreferences.mood
    );
  }

  return processed;
};

// Icons
const DeviceDesktopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const DeviceMobileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
