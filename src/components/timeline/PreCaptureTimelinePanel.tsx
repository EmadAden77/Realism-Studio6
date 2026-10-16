/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, History, Check, Sparkles, Bed, Activity, Coffee, Compass, Shirt, ShieldCheck } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { RECENT_ACTIVITIES } from '../../lib/presets/data';
import { RecentActivityType } from '../../types/scene';

export const PreCaptureTimelinePanel: React.FC = () => {
  const { state, updatePreCapture } = useSceneStore();
  const currentActivityId = state.preCaptureContext.recentActivity;
  const consequences = state.preCaptureContext.naturalConsequences;

  const currentActivity = RECENT_ACTIVITIES.find((a) => a.id === currentActivityId) || RECENT_ACTIVITIES[0];

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              محرك الخط الزمني لما قبل اللحظة (Pre-Capture Timeline)
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                V3.0
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              نمذجة النشاط البشري الأخير لتوليد تفاصيل فيزيائية حتمية (تجعيد القماش، انضغاط الفراش، اتجاه الشعر)
            </p>
          </div>
        </div>

        {/* Active Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{currentActivity.titleAr}</span>
          </span>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-neutral-300 block">
          اختر النشاط الذي سبق التقاط الصورة مباشرة:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {RECENT_ACTIVITIES.map((activity) => {
            const isSelected = activity.id === currentActivityId;
            return (
              <button
                key={activity.id}
                onClick={() => updatePreCapture(activity.id, 3)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-md shadow-amber-500/5'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-xs font-bold leading-tight">{activity.titleAr}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />}
                </div>
                <span className="text-[10px] text-neutral-400 line-clamp-2">
                  {activity.descriptionAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Derived Physical Consequences Box */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>الآثار الفيزيائية الحتمية المنبثقة تلقائيًا (Natural Consequences):</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
            خالٍ من المبالغة الدرامية
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {consequences.hairOrientationEffect && (
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-300 block">أثر الشعر (Hair Drape):</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{consequences.hairOrientationEffect}</p>
            </div>
          )}

          {consequences.beddingDeformationEffect && (
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-300 block">أثر الفراش والوسائد (Bedding Contact):</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{consequences.beddingDeformationEffect}</p>
            </div>
          )}

          {consequences.fabricTensionEffect && (
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-300 block">طيات شد الأقمشة (Fabric Drape):</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{consequences.fabricTensionEffect}</p>
            </div>
          )}

          {consequences.nearbyObjectsEffect && (
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-300 block">العناصر المجاورة (Contextual Objects):</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{consequences.nearbyObjectsEffect}</p>
            </div>
          )}

          {consequences.postureRelaxationEffect && (
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-amber-300 block">استرخاء القوام (Posture Relaxation):</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{consequences.postureRelaxationEffect}</p>
            </div>
          )}
        </div>

        {/* Anti-exaggeration guarantee note */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>ضمان عدم المبالغة: لا يتم أبدًا توليد عرق درامي أو شعر مشعث فوضوي أو اتساخ ما لم يقتضِ السياق الواقعي.</span>
        </div>
      </div>
    </div>
  );
};
