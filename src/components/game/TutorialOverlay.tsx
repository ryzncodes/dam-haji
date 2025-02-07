'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TutorialStep {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Dam Haji!',
    description: 'This tutorial will guide you through the basic rules of the game.',
  },
  {
    title: 'Basic Movement',
    description: 'Black pieces move upward diagonally, and red pieces move downward diagonally. Click on a piece to see its valid moves.',
  },
  {
    title: 'Capturing Pieces',
    description: 'When an enemy piece is diagonal to yours with an empty space behind it, you must capture it by jumping over. Captures are mandatory!',
  },
  {
    title: 'Multiple Captures',
    description: 'If you can capture multiple pieces in a row, you must continue capturing with the same piece until no more captures are possible.',
  },
  {
    title: 'King Promotion',
    description: 'When a piece reaches the opposite end of the board, it becomes a king! Kings can move and capture diagonally in any direction.',
  },
  {
    title: 'Winning the Game',
    description: 'Capture all enemy pieces or block them so they have no valid moves to win the game!',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay = ({ onComplete }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-lg p-6 max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="text-xl font-bold mb-2 text-yellow-400">
            {tutorialSteps[currentStep].title}
          </div>
          <div className="text-neutral-200">
            {tutorialSteps[currentStep].description}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            Skip Tutorial
          </button>
          <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-400">
              {currentStep + 1} / {tutorialSteps.length}
            </div>
            <button
              onClick={handleNext}
              className={cn(
                'px-4 py-2 rounded-md bg-yellow-500 text-black font-medium',
                'hover:bg-yellow-400 transition-colors'
              )}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Start Playing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay; 