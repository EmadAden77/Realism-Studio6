/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, HelpCircle, ShieldCheck, CheckCircle2, Info, Sparkles, ChevronLeft } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';

interface DecisionsExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionsExplanationModal: React.FC<DecisionsExplanationModalProps> = ({ isOpen, onClose }) => {
  const { state } = useSceneStore();

  if (!isOpen) return null;

  const decisions = state.sceneDecisions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">تفسير القرارات التلقائية للمشهد (Explainable Scene Decisions)</h3>
              <p className="text-[11px] text-neutral-400">شفافية كاملة حول القواعد الفيزيائية والافتراضات التي بنت إعدادات المشهد</p>
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              مبدأ الشفافية الصارمة: لا يدعي الذكاء الاصطناعي تحققًا فيزيائيًا حتميًا إلا إذا كان مستندًا إلى مدخلات هندسية واضحة، ويتم توثيق كل افتراض تلقائي أدناه.
            </span>
          </div>

          <div className="space-y-3">
            {decisions.map((dec) => (
              <div
                key={dec.id}
                className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-4 space-y-2.5 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{dec.propertyLabelAr}</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                      {dec.ruleId}
                    </span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${
                    dec.confidence === 'high'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                  }`}>
                    ثقة {dec.confidence === 'high' ? 'عالية (High)' : 'متوسطة'}
                  </span>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-neutral-200 leading-relaxed bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                  {dec.reasonAr}
                </p>

                {/* Assumptions */}
                {dec.assumptionsAr.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-neutral-400 block">الافتراضات التلقائية المعتمدة:</span>
                    <ul className="text-[11px] text-neutral-300 space-y-0.5 list-disc list-inside">
                      {dec.assumptionsAr.map((assump, idx) => (
                        <li key={idx}>{assump}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Alternatives */}
                {dec.alternativesAr && dec.alternativesAr.length > 0 && (
                  <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                    بدائل فيزيائية ممكنة: {dec.alternativesAr.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
