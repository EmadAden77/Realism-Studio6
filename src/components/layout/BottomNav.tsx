/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, User, Layers, Cpu, FileText, Bookmark } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';

export type NavTab = 'home' | 'character' | 'scene' | 'realism' | 'prompt' | 'library';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { state } = useSceneStore();
  const hasValidationIssues = state.validationIssues.length > 0;

  const items: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'character', label: 'الشخصية', icon: User },
    { id: 'scene', label: 'المشهد', icon: Layers },
    { id: 'realism', label: 'الواقعية', icon: Cpu },
    { id: 'prompt', label: 'البرومبت', icon: FileText },
    { id: 'library', label: 'المكتبة', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 safe-area-pb">
      <div className="max-w-xl mx-auto flex items-center justify-around px-1 py-1.5 sm:py-2">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.id === 'prompt' && hasValidationIssues && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                {item.id === 'realism' && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-6 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
