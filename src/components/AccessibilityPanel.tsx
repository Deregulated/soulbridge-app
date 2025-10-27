// src/components/AccessibilityPanel.tsx
import React, { useState, useEffect } from 'react';
import { Settings, Type, Eye, Volume2 } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      setSettings(JSON.parse(saved));
      applySettings(JSON.parse(saved));
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (newSettings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      highContrast: false,
      reduceMotion: false,
      screenReader: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 z-40"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-20 bg-white rounded-lg shadow-xl p-6 w-80 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accessibility Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 mr-2" />
                Font Size
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(50, settings.fontSize - 10))}
                  className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                >
                  A-
                </button>
                <span className="text-sm w-12 text-center">{settings.fontSize}%</span>
                <button
                  onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 10))}
                  className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Eye className="w-4 h-4 mr-2" />
                High Contrast
              </label>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-full py-2 px-3 rounded-md text-sm font-medium ${
                  settings.highContrast
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.highContrast ? 'Enabled' : 'Enable High Contrast'}
              </button>
            </div>

            {/* Reduce Motion */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Volume2 className="w-4 h-4 mr-2" />
                Reduce Motion
              </label>
              <button
                onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                className={`w-full py-2 px-3 rounded-md text-sm font-medium ${
                  settings.reduceMotion
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.reduceMotion ? 'Enabled' : 'Enable Reduced Motion'}
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full py-2 px-3 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </>
  );
};