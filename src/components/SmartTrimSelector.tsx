import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle, Plus } from 'lucide-react';
import { 
  getTrimsForModel, 
  hasTrimsForModel, 
  requestTrimsForModel,
  getSuggestedTrims 
} from '../data/carModels';

interface SmartTrimSelectorProps {
  make: string;
  model: string;
  value: string;
  onChange: (trim: string) => void;
  userEmail?: string;
  className?: string;
}

export function SmartTrimSelector({ 
  make, 
  model, 
  value, 
  onChange, 
  userEmail,
  className = "" 
}: SmartTrimSelectorProps) {
  const [trims, setTrims] = useState<string[]>([]);
  const [hasTrims, setHasTrims] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTrim, setCustomTrim] = useState('');
  const [requestLogged, setRequestLogged] = useState(false);

  useEffect(() => {
    if (make && model) {
      const modelHasTrims = hasTrimsForModel(make, model);
      setHasTrims(modelHasTrims);
      
      if (modelHasTrims) {
        setTrims(getTrimsForModel(make, model));
      } else {
        // Log the request for missing trims
        if (!requestLogged) {
          requestTrimsForModel(make, model, userEmail);
          setRequestLogged(true);
        }
        // Show suggested trims as fallback
        setTrims(getSuggestedTrims(make, model));
      }
    }
  }, [make, model, userEmail, requestLogged]);

  const handleTrimSelect = (selectedTrim: string) => {
    onChange(selectedTrim);
    setShowCustomInput(false);
  };

  const handleCustomTrimSubmit = () => {
    if (customTrim.trim()) {
      onChange(customTrim.trim());
      setCustomTrim('');
      setShowCustomInput(false);
    }
  };

  if (!make || !model) {
    return (
      <div className={`p-3 bg-gray-100 rounded-lg text-gray-500 text-center ${className}`}>
        Please select make and model first
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Status indicator */}
      <div className="mb-3">
        {hasTrims ? (
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Official trim data available</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Using suggested trims - request logged for official data</span>
          </div>
        )}
      </div>

      {/* Trim selection */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {trims.map((trim) => (
            <button
              key={trim}
              onClick={() => handleTrimSelect(trim)}
              className={`p-2 text-sm border rounded-lg transition-colors ${
                value === trim
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {trim}
            </button>
          ))}
          
          {/* Custom option */}
          <button
            onClick={() => setShowCustomInput(true)}
            className="p-2 text-sm border border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Other
          </button>
        </div>

        {/* Custom input */}
        {showCustomInput && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter custom trim level:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTrim}
                onChange={(e) => setCustomTrim(e.target.value)}
                placeholder="e.g., Limited Edition"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomTrimSubmit()}
              />
              <button
                onClick={handleCustomTrimSubmit}
                disabled={!customTrim.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTrim('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Selected trim display */}
        {value && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">Selected:</span>
              <span className="text-sm text-blue-700">{make} {model} {value}</span>
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            {hasTrims ? (
              <p>These are the official trim levels for the {make} {model}. Select the one that matches your preference or choose "Other" for custom trims.</p>
            ) : (
              <p>We don't have official trim data for the {make} {model} yet, so we're showing suggested options. Your request has been logged and we'll add official data soon. You can also enter a custom trim.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}