/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, GitCompare, RotateCcw, Plus, Minus, RefreshCw, Lock } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { comparePrompts } from '../../lib/prompt/promptComparison';

interface PromptComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousPrompt?: string;
}

export const PromptComparisonModal: React.FC<PromptComparisonModalProps> = ({
  isOpen,
  onClose,
  previousPrompt
}) => {
  const { state } = useSceneStore();
  const [copiedVer, setCopiedVer] = useState<'A' | 'B' | null>(null);

  if (!isOpen) return null;

  const currentPrompt = state.output.englishPrompt;
  const baseline =
    previousPrompt ||
    'Authentic photographic portrait of a 27-year-old Saudi Arabian young man (193cm tall, 83kg). pose: sitting on bed. shot on Xiaomi 15 Ultra 21mm f/2.0. lighting: daytime sunlight.';

  const comparison = comparePrompts(baseline, currentPrompt, 'النسخة السابقة (Version A)', 'النسخة الحالية (Version B)');
  const diff = comparison.detailedDiff;

  const handleCopy = (text: string, ver: 'A' | 'B') => {
    navigator.clipboard.writeText(text);
    setCopiedVer(ver);
    setTimeout(() => setCopiedVer(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">مقارنة التغييرات في البرومبت (Prompt Diff Engine)</h3>
              <p className="text-[11px] text-neutral-400">تدقيق إضافات وحذوفات التعليمات بدقة مع إبراز المحددات المقفلة الثابتة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center">
              <span className="text-emerald-400 font-bold text-lg font-mono">+{diff.added.length}</span>
              <span className="text-[11px] text-neutral-300 block">تعليمات مضافة</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-center">
              <span className="text-rose-400 font-bold text-lg font-mono">-{diff.removed.length}</span>
              <span className="text-[11px] text-neutral-300 block">تعليمات محذوفة</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center">
              <span className="text-amber-400 font-bold text-lg font-mono">{diff.modified.length}</span>
              <span className="text-[11px] text-neutral-300 block">خصائص معدلة</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-center">
              <span className="text-blue-400 font-bold text-lg font-mono">{diff.unchangedLocked.length}</span>
              <span className="text-[11px] text-neutral-300 block">أقفال ثابتة محفوظة</span>
            </div>
          </div>

          {/* Categorized Diff Highlights */}
          <div className="space-y-3">
            {/* Added */}
            {diff.added.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  التعليمات المضافة في النسخة الحالية:
                </span>
                <div className="space-y-1">
                  {diff.added.map((add, i) => (
                    <div key={i} className="text-xs text-emerald-200 font-mono bg-emerald-950/40 p-2 rounded border border-emerald-800/30">
                      + {add}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modified */}
            {diff.modified.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  الخصائص التي تم تعديل قيمتها:
                </span>
                <div className="space-y-2">
                  {diff.modified.map((mod, i) => (
                    <div key={i} className="text-xs font-mono p-2 rounded bg-neutral-950 border border-amber-800/40 space-y-1">
                      <div className="text-rose-300/80 line-through">- {mod.before}</div>
                      <div className="text-amber-300">+ {mod.after}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unchanged Locked */}
            {diff.unchangedLocked.length > 0 && (
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  المحددات المقفلة المحمية دون تغيير:
                </span>
                <div className="space-y-1">
                  {diff.unchangedLocked.map((lock, i) => (
                    <div key={i} className="text-[11px] text-blue-200 font-mono bg-blue-950/40 p-1.5 rounded border border-blue-800/30">
                      🔒 {lock}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side-by-side full prompt comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Version A */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">{comparison.versionA.name}</span>
                <button
                  onClick={() => handleCopy(baseline, 'A')}
                  className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1"
                >
                  {copiedVer === 'A' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedVer === 'A' ? 'تم النسخ' : 'نسخ A'}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono leading-relaxed max-h-44 overflow-y-auto p-2 bg-neutral-900 rounded border border-neutral-800">
                {baseline}
              </p>
            </div>

            {/* Version B */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{comparison.versionB.name}</span>
                <button
                  onClick={() => handleCopy(currentPrompt, 'B')}
                  className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold"
                >
                  {copiedVer === 'B' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedVer === 'B' ? 'تم النسخ' : 'نسخ B'}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-300 font-mono leading-relaxed max-h-44 overflow-y-auto p-2 bg-neutral-900 rounded border border-neutral-800">
                {currentPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            إغلاق نافذة المقارنة
          </button>
        </div>
      </div>
    </div>
  );
};
