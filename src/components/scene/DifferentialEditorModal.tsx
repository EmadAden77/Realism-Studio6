/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sliders, Lock, Check, Sparkles, Undo2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { EXPRESSION_PRESETS, HAIR_PRESETS, LIGHTING_MODES, POSE_PRESETS } from '../../lib/presets/data';

interface DifferentialEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DifferentialEditorModal: React.FC<DifferentialEditorModalProps> = ({ isOpen, onClose }) => {
  const { state, applySingleEdit, undo, canUndo } = useSceneStore();
  const [selectedTarget, setSelectedTarget] = useState<'lighting' | 'expression' | 'camera_angle' | 'hair'>('lighting');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEditLighting = (mode: string, label: string) => {
    applySingleEdit(
      'lighting.mode',
      'نمط الإضاءة',
      mode,
      `تعديل موضعي: تغيير الإضاءة إلى ${label} مع الحفاظ على الهوية والأبعاد والملابس`,
      (prev) => ({
        ...prev,
        lighting: {
          ...prev.lighting,
          mode: mode as any
        }
      })
    );
    setSuccessNotice(`تم تعديل الإضاءة إلى "${label}" مع حماية كاملة للهوية والملابس والغرفة.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleEditExpression = (presetId: string, label: string) => {
    applySingleEdit(
      'expression.presetId',
      'تعبير الوجه',
      presetId,
      `تعديل موضعي: تغيير تعبير الوجه إلى ${label} دون المساس بالإضاءة أو الملابس أو الكاميرا`,
      (prev) => ({
        ...prev,
        expression: {
          ...prev.expression,
          presetId
        }
      })
    );
    setSuccessNotice(`تم تعديل التعبير إلى "${label}" مع ثبات تام لجميع عناصر المشهد الأخرى.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleEditCameraAngle = (angle: string, label: string) => {
    applySingleEdit(
      'camera.angle',
      'زاوية الكاميرا',
      angle,
      `تعديل موضعي: ضبط زاوية الكاميرا إلى ${label}`,
      (prev) => ({
        ...prev,
        camera: {
          ...prev.camera,
          angle: angle as any
        }
      })
    );
    setSuccessNotice(`تم تعديل زاوية الكاميرا إلى "${label}".`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">التعديل التفاضلي الموضعي (Differential Scene Editing)</h3>
              <p className="text-[11px] text-neutral-400">تغيير خاصية واحدة فقط بشكل جراحي مع عزل وضمان ثبات جميع العناصر الأخرى</p>
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
          {/* Target Property Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              onClick={() => setSelectedTarget('lighting')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                selectedTarget === 'lighting' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              الإضاءة فقط
            </button>
            <button
              onClick={() => setSelectedTarget('expression')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                selectedTarget === 'expression' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              تعبير الوجه فقط
            </button>
            <button
              onClick={() => setSelectedTarget('camera_angle')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                selectedTarget === 'camera_angle' ? 'bg-amber-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              زاوية الكاميرا فقط
            </button>
          </div>

          {/* Success / Feedback Notice */}
          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{successNotice}</span>
              </div>
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-white flex items-center gap-1 font-semibold"
              >
                <Undo2 className="w-3 h-3" />
                <span>تراجع</span>
              </button>
            </div>
          )}

          {/* Preserved Locks Guarantee Card */}
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ضمان حماية الخصائص غير المستهدفة (State Preservation Guarantee):</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              عند تغيير الخاصية المحددة، يضمن النظام بنسبة 100% عدم إعادة توليد أو المساس بـ: الهوية، كثافة الشعر، الملابس، هندسة الغرفة، وزاوية الكاميرا ما لم تكن هي الهدف.
            </p>
          </div>

          {/* Controls for chosen target */}
          {selectedTarget === 'lighting' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">اختر نمط إضاءة جديد (مع ثبات كل شيء آخر):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LIGHTING_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleEditLighting(mode.id, mode.nameAr)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      state.lighting.mode === mode.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-xs block">{mode.nameAr}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{mode.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTarget === 'expression' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">اختر تعبير وجه جديد (مع ثبات الإضاءة والملابس):</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXPRESSION_PRESETS.map((expr) => (
                  <button
                    key={expr.id}
                    onClick={() => handleEditExpression(expr.id, expr.nameAr)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      state.expression.presetId === expr.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-xs block">{expr.nameAr}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{expr.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTarget === 'camera_angle' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">اختر زاوية كاميرا جديدة:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'eye_level', labelAr: 'مستوى العين طبيعي' },
                  { id: 'slightly_elevated', labelAr: 'مرتفعة قليلاً' },
                  { id: 'elevated', labelAr: 'علوية سيلفي' },
                  { id: 'low_angle', labelAr: 'منخفضة' },
                  { id: 'lateral_right', labelAr: 'جانبية خفيفة (يمين)' },
                  { id: 'lateral_left', labelAr: 'جانبية خفيفة (يسار)' }
                ].map((ang) => (
                  <button
                    key={ang.id}
                    onClick={() => handleEditCameraAngle(ang.id, ang.labelAr)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      state.camera.angle === ang.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-xs block">{ang.labelAr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            سجل التعديلات الموضعية: {state.sceneDiff.activeSessionChanges.length} تعديل
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            تم الانتهاء
          </button>
        </div>
      </div>
    </div>
  );
};
