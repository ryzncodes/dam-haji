'use client';

import { cn } from '@/lib/utils';
import { INITIAL_GAME_SETTINGS } from '@/constants/game';
import type { GameSettings } from '@/types/game';
import { useState } from 'react';

interface GameSettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
  onNewGame: () => void;
}

const GameSettings = ({ settings, onSettingsChange, onClose, onNewGame }: GameSettingsProps) => {
  // Add temporary settings state
  const [tempSettings, setTempSettings] = useState<GameSettings>(settings);

  const handleSettingChange = (key: keyof GameSettings, value: number | boolean) => {
    // If changing board size, set appropriate default pieces per player
    if (key === 'boardSize') {
      const boardSize = value as number;
      const newPiecesPerPlayer = boardSize === 6 ? 6 : boardSize === 8 ? 12 : 15;
      setTempSettings({
        ...tempSettings,
        boardSize,
        piecesPerPlayer: newPiecesPerPlayer
      });
      return;
    }
    
    setTempSettings({
      ...tempSettings,
      [key]: value,
    });
  };

  const handleSave = () => {
    // Only trigger new game if settings actually changed
    if (
      tempSettings.boardSize !== settings.boardSize ||
      tempSettings.piecesPerPlayer !== settings.piecesPerPlayer ||
      tempSettings.mandatoryCapture !== settings.mandatoryCapture
    ) {
      onSettingsChange(tempSettings);
      onNewGame(); // Start a new game with new settings
    }
    onClose();
  };

  const handleReset = () => {
    setTempSettings(INITIAL_GAME_SETTINGS);
  };

  const renderPiecesOptions = () => {
    switch (tempSettings.boardSize) {
      case 6:
        return (
          <>
            <option value={6}>6 pieces</option>
          </>
        );
      case 8:
        return (
          <>
            <option value={8}>8 pieces</option>
            <option value={12}>12 pieces</option>
          </>
        );
      case 10:
        return (
          <>
            <option value={10}>10 pieces</option>
            <option value={15}>15 pieces</option>
          </>
        );
      default:
        return null;
    }
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
              value={tempSettings.boardSize}
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
              value={tempSettings.piecesPerPlayer}
              onChange={(e) => handleSettingChange('piecesPerPlayer', Number(e.target.value))}
              className="w-full bg-neutral-800 rounded-md px-3 py-2 text-neutral-200 border border-neutral-700"
            >
              {renderPiecesOptions()}
            </select>
          </div>

          {/* Mandatory Capture */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-200">
              Mandatory Capture
            </label>
            <button
              onClick={() => handleSettingChange('mandatoryCapture', !tempSettings.mandatoryCapture)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                tempSettings.mandatoryCapture ? 'bg-yellow-500' : 'bg-neutral-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  tempSettings.mandatoryCapture ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
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