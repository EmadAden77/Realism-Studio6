/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { CharacterStudio } from './components/character/CharacterStudio';
import { EnvironmentStudio } from './components/environment/EnvironmentStudio';
import { RealismStudio } from './components/realism/RealismStudio';
import { ImageReviewStudio } from './components/realism/ImageReviewStudio';
import { PromptOutputView } from './components/output/PromptOutputView';
import { LibraryView } from './components/library/LibraryView';
import { ValidationPanel } from './components/validation/ValidationPanel';
import { SettingsModal } from './components/settings/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('realism');
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageReviewOpen, setIsImageReviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenImageReview={() => setIsImageReviewOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full" role="main">
        {activeTab === 'home' && (
          <HomeDashboard
            onNavigateToPrompt={() => setActiveTab('prompt')}
            onNavigateToScene={() => setActiveTab('scene')}
            onNavigateToCharacter={() => setActiveTab('character')}
          />
        )}

        {activeTab === 'character' && <CharacterStudio />}

        {activeTab === 'scene' && <EnvironmentStudio />}

        {activeTab === 'realism' && <RealismStudio />}

        {activeTab === 'prompt' && <PromptOutputView />}

        {activeTab === 'library' && (
          <LibraryView onLoadAndNavigateToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Mobile-First Bottom Navigation with Realism Tab */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Validation Panel Modal */}
      <ValidationPanel
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Optional Generated Image Realism Review Modal */}
      {isImageReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <span className="font-bold text-white text-sm">تدقيق الصور المولدة فيزيائيًا (Image Realism Review)</span>
              <button
                onClick={() => setIsImageReviewOpen(false)}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition"
              >
                إغلاق
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <ImageReviewStudio />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
