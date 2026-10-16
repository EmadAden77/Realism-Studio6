/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, ShieldCheck, AlertTriangle, Undo2, Redo2, Sparkles, Sliders } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenValidation: () => void;
  onOpenImageReview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenValidation, onOpenImageReview }) => {
  const { state, undo, redo, canUndo, canRedo } = useSceneStore();
  const issueCount = state.validationIssues.length;
  const hasErrors = state.validationIssues.some((i) => i.severity === 'error');

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & App Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                REALISM STUDIO
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  AI V3.0
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              محرك ذكاء المشهد ومطابقة المرجع المتقدم • شاومي 15 ألترا
            </p>
          </div>
        </div>

        {/* Center / Action Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Optional Image Review Button */}
          {onOpenImageReview && (
            <button
              onClick={onOpenImageReview}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-200 transition"
              title="تدقيق صورة مولدة"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">تدقيق الصور</span>
            </button>
          )}

          {/* Validation Status Button */}
          <button
            onClick={onOpenValidation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
              issueCount === 0
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/40'
                : hasErrors
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/50 hover:bg-rose-900/40 animate-pulse'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/40 hover:bg-amber-900/40'
            }`}
            title="فحص التعارضات الفيزيائية"
          >
            {issueCount === 0 ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">متوافق فيزيائيًا</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{issueCount} تعارض</span>
              </>
            )}
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center bg-neutral-800/70 rounded-md p-0.5 border border-neutral-700/50">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded text-neutral-300 hover:text-white transition-all ${
                !canUndo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-700'
              }`}
              title="تراجع"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded text-neutral-300 hover:text-white transition-all ${
                !canRedo ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-700'
              }`}
              title="إعادة"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 transition"
            title="الإعدادات المتقدمة"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
