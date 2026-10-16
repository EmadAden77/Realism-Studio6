/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, AlertTriangle, AlertCircle, Info, Wand2, Check } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';

interface ValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ isOpen, onClose }) => {
  const { state, applyAutoCorrections } = useSceneStore();

  if (!isOpen) return null;

  const issues = state.validationIssues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                فحص الاتساق والتعارضات الفيزيائية (Physics Audit)
              </h3>
              <p className="text-[11px] text-neutral-400">
                التحقق الصارم من عدم تعارض الكاميرا والإضاءة والبيئة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">المشهد متطابق فيزيائيًا 100%</h4>
              <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                لا توجد تعارضات بين العدسة والمسافة المحددة، والإضاءة متوافقة مع أوقات النهار وظلال البيئة المحيطة.
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const isError = issue.severity === 'error';
              const isWarning = issue.severity === 'warning';

              return (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-xl border ${
                    isError
                      ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                      : isWarning
                      ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                      : 'bg-blue-950/30 border-blue-800/40 text-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {!isError && !isWarning && <Info className="w-4 h-4 text-blue-400" />}
                      {issue.titleAr}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                      {issue.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 mb-2 leading-relaxed">{issue.messageAr}</p>

                  <div className="text-[10px] text-neutral-400 font-mono bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                    <div>Conflicting fields: {issue.conflictingFields.join(', ')}</div>
                    <div className="text-neutral-500 mt-0.5">{issue.explanationEn}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {issues.length} {issues.length === 1 ? 'ملاحظة' : 'ملاحظات'}
          </span>

          <div className="flex items-center gap-2">
            {issues.length > 0 && (
              <button
                onClick={applyAutoCorrections}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>تصحيح كافة التعارضات تلقائيًا</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
