'use client';

import { cn } from '@/lib/utils';
import { INITIAL_GAME_SETTINGS } from '@/constants/game';
import type { GameSettings } from '@/types/game';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

const GameSettings = ({ settings, onSettingsChange, onClose }: GameSettingsProps) => {
  const handleSettingChange = (key: keyof GameSettings, value: number | boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-lg p-6 max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Game Settings</h2>

        <div className="space-y-4">
          {/* Board Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">
              Board Size
            </label>
            <select
              value={settings.boardSize}
              onChange={(e) => handleSettingChange('boardSize', Number(e.target.value))}
              className="w-full bg-neutral-800 rounded-md px-3 py-2 text-neutral-200 border border-neutral-700"
            >
              <option value={6}>6 x 6</option>
              <option value={8}>8 x 8</option>
              <option value={10}>10 x 10</option>
            </select>
          </div>

          {/* Pieces Per Player */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-200">
              Pieces Per Player
            </label>
            <select
              value={settings.piecesPerPlayer}
              onChange={(e) => handleSettingChange('piecesPerPlayer', Number(e.target.value))}
              className="w-full bg-neutral-800 rounded-md px-3 py-2 text-neutral-200 border border-neutral-700"
            >
              <option value={6}>6 pieces</option>
              <option value={9}>9 pieces</option>
              <option value={12}>12 pieces</option>
            </select>
          </div>

          {/* Mandatory Capture */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-200">
              Mandatory Capture
            </label>
            <button
              onClick={() => handleSettingChange('mandatoryCapture', !settings.mandatoryCapture)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.mandatoryCapture ? 'bg-yellow-500' : 'bg-neutral-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.mandatoryCapture ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => {
              onSettingsChange(INITIAL_GAME_SETTINGS);
            }}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-yellow-500 text-black font-medium hover:bg-yellow-400"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSettings; 