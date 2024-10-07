import React, { useState } from 'react';

interface SettingsPanelProps {
  apiKey: string;
  onClose: () => void;
  onSave: (apiKey: string) => Promise<void>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  apiKey,
  onClose,
  onSave,
}) => {
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSave = async () => {
    setIsVerifying(true);
    await onSave(newApiKey);
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="password"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            disabled={isVerifying}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;