import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { X } from 'lucide-react';

const InputDialog: React.FC = () => {
  const { inputDialog, closeInputDialog } = useAppStore();
  const [inputValue, setInputValue] = useState('');

  if (!inputDialog.isOpen) return null;

  const handleSubmit = () => {
    if (inputDialog.onSubmit) {
      inputDialog.onSubmit(inputValue);
    }
    setInputValue('');
    closeInputDialog();
  };

  const handleCancel = () => {
    setInputValue('');
    closeInputDialog();
  };

  const isMultiline = inputDialog.schema?.multiline === true;
  const isFile = inputDialog.schema?.type === 'file';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {inputDialog.label}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            {isFile
              ? 'Enter or paste the file content below:'
              : isMultiline
              ? 'Enter your text below (supports multiple lines):'
              : 'Enter your input:'}
          </p>

          {isMultiline || isFile ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-32"
              placeholder={
                isFile
                  ? 'Paste file content here...'
                  : 'Type your text here...'
              }
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your input..."
              autoFocus
            />
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!inputValue.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputDialog;
