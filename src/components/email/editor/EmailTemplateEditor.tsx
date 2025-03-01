import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATE
} from '../../../graphql/email';
import { Editor } from '@tinymce/tinymce-react';
import { emailTemplateVariations } from '../../../services/email/EmailTemplateVariations';

interface EmailTemplateEditorProps {
  templateId?: string;
  onSave?: (template: any) => void;
}

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  templateId,
  onSave
}) => {
  const [template, setTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'NEWSLETTER',
    style: 'modern',
    version: '1.0'
  });

  const [previewData, setPreviewData] = useState({
    desktop: true,
    showVariables: false
  });

  const [selectedSection, setSelectedSection] = useState('content');
  const [showPreview, setShowPreview] = useState(false);

  const { data: templateData } = useQuery(GET_EMAIL_TEMPLATE, {
    variables: { id: templateId },
    skip: !templateId
  });

  const [createTemplate] = useMutation(CREATE_EMAIL_TEMPLATE);
  const [updateTemplate] = useMutation(UPDATE_EMAIL_TEMPLATE);

  useEffect(() => {
    if (templateData?.emailTemplate) {
      setTemplate(templateData.emailTemplate);
    }
  }, [templateData]);

  const handleSave = async () => {
    try {
      const mutation = templateId ? updateTemplate : createTemplate;
      const { data } = await mutation({
        variables: {
          input: template,
          id: templateId
        }
      });

      onSave?.(data.template);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="flex h-full">
      {/* Editor Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <nav className="space-y-2">
          <button
            className={`w-full p-2 text-left rounded ${
              selectedSection === 'content' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setSelectedSection('content')}
          >
            Content
          </button>
          <button
            className={`w-full p-2 text-left rounded ${
              selectedSection === 'style' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setSelectedSection('style')}
          >
            Style
          </button>
          <button
            className={`w-full p-2 text-left rounded ${
              selectedSection === 'personalization' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setSelectedSection('personalization')}
          >
            Personalization
          </button>
          <button
            className={`w-full p-2 text-left rounded ${
              selectedSection === 'settings' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setSelectedSection('settings')}
          >
            Settings
          </button>
        </nav>

        <div className="mt-8">
          <h3 className="font-medium mb-2">Template Variables</h3>
          <div className="space-y-1 text-sm">
            <div className="p-1 bg-gray-200 rounded">{'{{firstName}}'}</div>
            <div className="p-1 bg-gray-200 rounded">{'{{recommendations}}'}</div>
            <div className="p-1 bg-gray-200 rounded">{'{{scentProfile}}'}</div>
            <div className="p-1 bg-gray-200 rounded">{'{{seasonalContent}}'}</div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              placeholder="Template Name"
              className="border rounded px-3 py-1"
            />
            <select
              value={template.category}
              onChange={(e) =>
                setTemplate({ ...template, category: e.target.value })
              }
              className="border rounded px-3 py-1"
            >
              <option value="NEWSLETTER">Newsletter</option>
              <option value="ABANDONED_CART">Abandoned Cart</option>
              <option value="WELCOME_SERIES">Welcome Series</option>
              <option value="PRODUCT_LAUNCH">Product Launch</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">
          {selectedSection === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) =>
                    setTemplate({ ...template, subject: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter subject line"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Content</label>
                <Editor
                  apiKey="your-tinymce-api-key"
                  value={template.content}
                  onEditorChange={(content) =>
                    setTemplate({ ...template, content })
                  }
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                />
              </div>
            </div>
          )}

          {selectedSection === 'style' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Layout</h3>
                <div className="grid grid-cols-3 gap-4">
                  <LayoutOption
                    name="Single Column"
                    selected={template.style === 'single-column'}
                    onClick={() =>
                      setTemplate({ ...template, style: 'single-column' })
                    }
                  />
                  <LayoutOption
                    name="Two Column"
                    selected={template.style === 'two-column'}
                    onClick={() =>
                      setTemplate({ ...template, style: 'two-column' })
                    }
                  />
                  <LayoutOption
                    name="Magazine"
                    selected={template.style === 'magazine'}
                    onClick={() =>
                      setTemplate({ ...template, style: 'magazine' })
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Color Scheme</h3>
                <div className="grid grid-cols-4 gap-4">
                  <ColorScheme
                    name="Light"
                    colors={['#ffffff', '#f3f4f6', '#9ca3af']}
                    selected={template.colorScheme === 'light'}
                    onClick={() =>
                      setTemplate({ ...template, colorScheme: 'light' })
                    }
                  />
                  <ColorScheme
                    name="Dark"
                    colors={['#1f2937', '#4b5563', '#9ca3af']}
                    selected={template.colorScheme === 'dark'}
                    onClick={() =>
                      setTemplate({ ...template, colorScheme: 'dark' })
                    }
                  />
                  <ColorScheme
                    name="Seasonal"
                    colors={['#c084fc', '#818cf8', '#34d399']}
                    selected={template.colorScheme === 'seasonal'}
                    onClick={() =>
                      setTemplate({ ...template, colorScheme: 'seasonal' })
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Typography</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Heading Font
                    </label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Helvetica Neue</option>
                      <option>Montserrat</option>
                      <option>Playfair Display</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Body Font
                    </label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Arial</option>
                      <option>Open Sans</option>
                      <option>Lora</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'personalization' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Dynamic Content</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={true}
                    />
                    <span className="ml-2">Seasonal Header</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={true}
                    />
                    <span className="ml-2">Product Recommendations</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={true}
                    />
                    <span className="ml-2">Scent Profile</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={true}
                    />
                    <span className="ml-2">Social Proof</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Personalization Rules</h3>
                <div className="space-y-4">
                  <div className="border rounded p-4">
                    <h4 className="font-medium mb-2">Product Recommendations</h4>
                    <div className="space-y-2">
                      <label className="block text-sm">Number of Products</label>
                      <input
                        type="number"
                        className="border rounded px-3 py-1"
                        min="1"
                        max="6"
                        value="4"
                      />
                    </div>
                  </div>

                  <div className="border rounded p-4">
                    <h4 className="font-medium mb-2">Content Visibility</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={true}
                        />
                        <span className="ml-2">
                          Show scent profile if available
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={true}
                        />
                        <span className="ml-2">
                          Include purchase history recommendations
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Template Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={template.version}
                      onChange={(e) =>
                        setTemplate({ ...template, version: e.target.value })
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Preview Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={previewData.desktop}
                      onChange={(e) =>
                        setPreviewData({
                          ...previewData,
                          desktop: e.target.checked
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2">Desktop Preview</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={previewData.showVariables}
                      onChange={(e) =>
                        setPreviewData({
                          ...previewData,
                          showVariables: e.target.checked
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2">Show Variables</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl h-3/4 rounded-lg flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">Template Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div
                className={`mx-auto ${
                  previewData.desktop ? 'max-w-2xl' : 'max-w-sm'
                }`}
              >
                <div className="border rounded">
                  <div
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface LayoutOptionProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

const LayoutOption: React.FC<LayoutOptionProps> = ({
  name,
  selected,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`p-4 border rounded text-center ${
      selected ? 'border-blue-500 bg-blue-50' : ''
    }`}
  >
    {name}
  </button>
);

interface ColorSchemeProps {
  name: string;
  colors: string[];
  selected: boolean;
  onClick: () => void;
}

const ColorScheme: React.FC<ColorSchemeProps> = ({
  name,
  colors,
  selected,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`p-4 border rounded ${
      selected ? 'border-blue-500 bg-blue-50' : ''
    }`}
  >
    <div className="flex space-x-1 mb-2">
      {colors.map((color) => (
        <div
          key={color}
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    <div className="text-sm">{name}</div>
  </button>
);
