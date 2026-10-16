/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronLeft, Wand2 } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';

interface ReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadinessModal: React.FC<ReadinessModalProps> = ({ isOpen, onClose }) => {
  const { state, applyAutoCorrections } = useSceneStore();

  if (!isOpen) return null;

  const readiness = state.readinessStatus;
  const isReady = readiness.status === 'ready';
  const hasWarnings = readiness.status === 'ready_with_warnings';
  const isInvalid = readiness.status === 'invalid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${
              isReady
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isInvalid
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">مدقق جاهزية المشهد الفيزيائي (Scene Readiness Validator)</h3>
              <p className="text-[11px] text-neutral-400">فحص المعايير الـ 12 المحددة لصلاحية المشهد دون نسب مئوية وهمية</p>
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
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-2 ${
            isReady
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
              : isInvalid
              ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
              : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
          }`}>
            <div className="space-y-0.5">
              <span className="font-bold text-xs sm:text-sm block">{readiness.statusLabelAr}</span>
              <p className="text-xs text-neutral-300">{readiness.scoreExplanationAr}</p>
            </div>

            {isInvalid && (
              <button
                onClick={applyAutoCorrections}
                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>تصحيح تلقائي فوري</span>
              </button>
            )}
          </div>

          {/* Warnings List */}
          {readiness.warnings.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                تنبيهات التدقيق:
              </span>
              <ul className="text-xs text-amber-200 space-y-1 list-disc list-inside">
                {readiness.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 12-Item Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white block">قائمة التحقق الفيزيائية الـ 12:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {readiness.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    item.passed
                      ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  }`}
                >
                  <div className={`p-1 rounded-full shrink-0 mt-0.5 ${
                    item.passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {item.passed ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className="font-bold text-white block text-[11px]">{item.labelAr}</span>
                    <span className="text-[10px] text-neutral-400 block">{item.detailsAr}</span>
                  </div>
                </div>
              ))}
            </div>
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
