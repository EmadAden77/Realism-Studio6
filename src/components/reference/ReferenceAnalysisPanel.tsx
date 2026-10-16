/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  AlertTriangle,
  HelpCircle,
  EyeOff,
  Edit3,
  Check,
  X,
  Sparkles,
  Lock,
  Scissors,
  Info
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { ReferenceObservation } from '../../types/scene';

export const ReferenceAnalysisPanel: React.FC = () => {
  const {
    state,
    triggerReferenceAnalysis,
    updateObservationCorrection,
    enforceCompatibleHair
  } = useSceneStore();

  const refState = state.referenceAnalysis;
  const [editingProp, setEditingProp] = useState<string | null>(null);
  const [correctionValue, setCorrectionValue] = useState<string>('');

  const handleStartEdit = (obs: ReferenceObservation) => {
    setEditingProp(obs.property);
    setCorrectionValue(obs.userCorrection || obs.value || '');
  };

  const handleSaveEdit = (property: string) => {
    updateObservationCorrection(property, correctionValue);
    setEditingProp(null);
  };

  const hairCompatibility = refState.hairCompatibility;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header and Trigger Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              ذكاء مطابقة المرجع وتدقيق عدم اليقين (Reference Fidelity)
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                V3.0
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              استخراج الملامح المرئية بدقة مع التمييز الصارم بين المؤكد والمحجوب بالظلال والزاوية
            </p>
          </div>
        </div>

        {/* Explicit Trigger Button (Never runs automatically without user request) */}
        <button
          onClick={() => triggerReferenceAnalysis({ isPartialHairlineOccluded: true, hasShadows: true })}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-lg shadow-amber-500/10 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>تحليل ومطابقة المرجع الآن</span>
        </button>
      </div>

      {/* Reference Image State Banner */}
      {!state.identity.referenceImageUrl ? (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-bold">تنبيه المرجع:</span> لم يتم تزويد صورة مرجعية في استديو الشخصية. يمتنع النظام تمامًا عن ادعاء التحقق من الهوية بدون صورة حقيقية واضحة.
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الصورة المرجعية النشطة:</span>
            <span className="font-mono text-white font-semibold">{state.identity.referenceImageName || 'reference_image.jpg'}</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
            {refState.isAnalyzed ? 'تم التدقيق الفيزيائي' : 'في انتظار طلب التحليل'}
          </span>
        </div>
      )}

      {/* Hair Compatibility Section */}
      {hairCompatibility.warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Scissors className="w-4 h-4 text-rose-400" />
              <span>تحذير تعارض تسريحة الشعر مع المرجع الأصلي</span>
            </div>
            <button
              onClick={enforceCompatibleHair}
              className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-neutral-950 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>استعادة كثافة المرجع</span>
            </button>
          </div>
          <p className="text-xs text-rose-200">
            {hairCompatibility.warnings[0]}
          </p>
          <div className="text-[11px] text-neutral-400">
            الحل المقترح: {hairCompatibility.suggestions[0]}
          </div>
        </div>
      )}

      {/* Uncertainty Notice */}
      <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-xs text-neutral-300 space-y-1">
        <div className="font-semibold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>مبدأ النزاهة الفيزيائية (Honest Observation Principle):</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          أي منطقة محجوبة بزاوية الكاميرا أو الظلال أو تصفيفة الشعر يتم وسمها كـ (غير مؤكدة / غير مرصودة) بدلاً من اختلاق تفاصيل وهمية غير موجودة في الصورة.
        </p>
      </div>

      {/* Observations List */}
      {refState.observations.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-white px-1">
            <span>سجل الخصائص المستخرجة والتصنيف ({refState.observations.length}):</span>
            <span className="text-[11px] text-neutral-400">يمكنك تعديل أي ملاحظة مباشرة</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {refState.observations.map((obs) => {
              const isEditing = editingProp === obs.property;

              // Visibility badge style
              let badgeColor = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
              let badgeIcon = Eye;
              let badgeText = 'مرئي بوضوح';

              if (obs.visibility === 'partially_visible') {
                badgeColor = 'bg-amber-950/60 text-amber-300 border-amber-800/60';
                badgeIcon = AlertTriangle;
                badgeText = 'مرئي جزئيًا';
              } else if (obs.visibility === 'uncertain') {
                badgeColor = 'bg-purple-950/60 text-purple-300 border-purple-800/60';
                badgeIcon = HelpCircle;
                badgeText = 'غير مؤكد بالظل';
              } else if (obs.visibility === 'not_observable') {
                badgeColor = 'bg-neutral-800 text-neutral-400 border-neutral-700';
                badgeIcon = EyeOff;
                badgeText = 'محجوب تمامًا';
              }

              const BadgeIcon = badgeIcon;

              return (
                <div
                  key={obs.property}
                  className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 space-y-2 transition hover:border-neutral-700"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{obs.propertyNameAr}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">({obs.property})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold ${badgeColor}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badgeText}</span>
                      </span>

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(obs)}
                          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                          title="تعديل الملاحظة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1 animate-in fade-in">
                      <textarea
                        value={correctionValue}
                        onChange={(e) => setCorrectionValue(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-neutral-900 border border-amber-500/60 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProp(null)}
                          className="px-2.5 py-1 rounded text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>إلغاء</span>
                        </button>
                        <button
                          onClick={() => handleSaveEdit(obs.property)}
                          className="px-3 py-1 rounded text-xs bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>حفظ التصحيح</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {obs.value ? (
                        <span>{obs.value}</span>
                      ) : (
                        <span className="text-neutral-500 italic">لا توجد ملاحظة مؤكدة (محجوبة عن العدسة)</span>
                      )}

                      {obs.userVerified && (
                        <span className="mr-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded font-mono">
                          ✓ تم تدقيق المستخدم
                        </span>
                      )}
                    </div>
                  )}

                  {obs.notes && !isEditing && (
                    <div className="text-[10px] text-amber-300/80 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                      {obs.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
