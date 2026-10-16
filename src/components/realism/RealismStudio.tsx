import { V6LocalStudio } from './V6LocalStudio';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContextualPhysicsPanel } from './ContextualPhysicsPanel';
import React, { useState } from 'react';
import {
  ShieldCheck,
  Camera,
  Moon,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  Box,
  CheckCircle,
  HelpCircle,
  Cpu,
  Smartphone,
  Clock,
  Eye,
  GitCompare
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { CandidnessLevel } from '../../types/scene';
import { GeometryCalibrationPanel } from '../geometry/GeometryCalibrationPanel';
import { PreCaptureTimelinePanel } from '../timeline/PreCaptureTimelinePanel';
import { ReferenceAnalysisPanel } from '../reference/ReferenceAnalysisPanel';
import { DifferentialEditorModal } from '../scene/DifferentialEditorModal';
import { DecisionsExplanationModal } from '../explanations/DecisionsExplanationModal';
import { ReadinessModal } from '../validation/ReadinessModal';

export const RealismStudio: React.FC = () => {
  const { state, updateGlobalSceneState } = useSceneStore();
  const realism = state.realismIntelligence;

  const [activeSubTab, setActiveSubTab] = useState<'framing' | 'timeline' | 'reference' | 'v2_controls'>('framing');
  const [isDiffEditorOpen, setIsDiffEditorOpen] = useState(false);
  const [isDecisionsOpen, setIsDecisionsOpen] = useState(false);
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);

  const updateRealism = (patch: Partial<typeof realism>) => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      realismIntelligence: {
        ...prev.realismIntelligence,
        ...patch
      }
    }));
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-3 sm:px-6 pt-3">
      {/* 1. Header Banner & Quick Actions */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ذكاء المشهد ومطابقة المرجع V3.0</span>
                <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800" dir="ltr">
                  Scene Intelligence & Fidelity Engine
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                محاكاة تأطير السيلفي 9:16، الخط الزمني للنشاط السابق، وتدقيق المرجع مع حماية عدم اليقين
              </p>
            </div>
          </div>

          {/* Action Modals Triggers */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setIsReadinessOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>مدقق الجاهزية</span>
            </button>
            <button
              onClick={() => setIsDiffEditorOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>تعديل خاصية واحدة</span>
            </button>
            <button
              onClick={() => setIsDecisionsOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>تفسير القرارات</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('framing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'framing'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>محاكي التأطير والهندسة (9:16)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'timeline'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>الخط الزمني للنشاط السابق</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reference')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'reference'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>مطابقة المرجع وتدقيق الهوية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('v2_controls')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'v2_controls'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>محددات الانضباط V2</span>
          </button>
        </div>
      </section>

      {/* Render Active Sub-Tab */}
      {activeSubTab === 'framing' && <GeometryCalibrationPanel />}
      {activeSubTab === 'timeline' && <PreCaptureTimelinePanel />}
      {activeSubTab === 'reference' && <ReferenceAnalysisPanel />}

      {/* V2 Controls Tab */}
      {activeSubTab === 'v2_controls' && (
        <>

      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>محددات ومعايير الانضباط الفيزيائي (Strictness Controls)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 1. Optical Geometry Strictness */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">صرامة الهندسة البصرية (21mm / 23mm)</span>
              <span className="text-amber-400 font-mono uppercase">{realism.opticalGeometryStrictness}</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              منع زوايا الاستوديو المضغوطة 85mm وفرض المنظور الحقيقي لشاومي 15 ألترا
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(['low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateRealism({ opticalGeometryStrictness: lvl })}
                  className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition ${
                    realism.opticalGeometryStrictness === lvl
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {lvl === 'low' && 'منخفض'}
                  {lvl === 'medium' && 'معتدل'}
                  {lvl === 'high' && 'صارم ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Lighting Physics Strictness */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">صرامة فيزياء الإضاءة (Inverse-Square)</span>
              <span className="text-amber-400 font-mono uppercase">{realism.lightingPhysicsStrictness}</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              تلاشي ضوئي حقيقي ومنع الأضواء الخفية (Invisible Fill) وأضواء الحواف
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(['normal', 'high', 'very_high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateRealism({ lightingPhysicsStrictness: lvl })}
                  className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition ${
                    realism.lightingPhysicsStrictness === lvl
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {lvl === 'normal' && 'عادي'}
                  {lvl === 'high' && 'عالي'}
                  {lvl === 'very_high' && 'فائق ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Natural Texture Protection */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">حماية الملمس الطبيعي للبشرة</span>
              <span className="text-amber-400 font-mono uppercase">{realism.naturalTextureProtection}</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              حظر الفلاتر التجميلية وتنعيم الشمع الرقمي (Anti-Plastic Skin)
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {(['normal', 'high', 'very_high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateRealism({ naturalTextureProtection: lvl })}
                  className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition ${
                    realism.naturalTextureProtection === lvl
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {lvl === 'normal' && 'عادي'}
                  {lvl === 'high' && 'عالي'}
                  {lvl === 'very_high' && 'فائق ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Candid Motion Intensity */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">طبيعية اللحظة العفوية (Candidness)</span>
              <span className="text-amber-400 font-mono">{realism.candidMotionIntensity}</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              تجنب الوضعيات المتجمدة كالتماثيل وإبراز حركات تنفس وارتخاء طبيعية
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { id: 'still_natural', label: 'ساكن طبيعي' },
                { id: 'everyday_candid', label: 'عفوي يومي ✓' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateRealism({ candidMotionIntensity: opt.id as CandidnessLevel })}
                  className={`py-1.5 rounded-lg border text-center font-bold text-[11px] transition ${
                    realism.candidMotionIntensity === opt.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-neutral-800">
          <button
            onClick={() => updateRealism({ materialPhysicsEnforcement: !realism.materialPhysicsEnforcement })}
            className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
              realism.materialPhysicsEnforcement
                ? 'bg-neutral-800 border-amber-500/50 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div>
              <span className="font-bold block text-xs">فيزياء المواد والأسطح</span>
              <span className="text-[10px] text-neutral-400">خشونة الأقمشة وتشتت الضوء</span>
            </div>
            <span className={`text-xs font-mono font-bold ${realism.materialPhysicsEnforcement ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {realism.materialPhysicsEnforcement ? 'مفعل' : 'معطل'}
            </span>
          </button>

          <button
            onClick={() => updateRealism({ sceneContinuityLock: !realism.sceneContinuityLock })}
            className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
              realism.sceneContinuityLock
                ? 'bg-neutral-800 border-amber-500/50 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div>
              <span className="font-bold block text-xs">قفل استمرارية الغرفة 3D</span>
              <span className="text-[10px] text-neutral-400">ثبات الأثاث عند تغيير الزاوية</span>
            </div>
            <span className={`text-xs font-mono font-bold ${realism.sceneContinuityLock ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {realism.sceneContinuityLock ? 'مفعل' : 'معطل'}
            </span>
          </button>

          <button
            onClick={() => updateRealism({ automaticExaggerationReduction: !realism.automaticExaggerationReduction })}
            className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${
              realism.automaticExaggerationReduction
                ? 'bg-neutral-800 border-amber-500/50 text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400'
            }`}
          >
            <div>
              <span className="font-bold block text-xs">خفض المبالغات التلقائي</span>
              <span className="text-[10px] text-neutral-400">منع الفخامة أو الإضاءة الزائدة</span>
            </div>
            <span className={`text-xs font-mono font-bold ${realism.automaticExaggerationReduction ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {realism.automaticExaggerationReduction ? 'مفعل' : 'معطل'}
            </span>
          </button>
        </div>
      </section>

      {/* 3. Contact Physics & Bed/Pillow Mechanics */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>فيزياء التلامس والأثقال (Contact & Compression Mechanics)</span>
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          تضمن هذه القواعد عدم ظهور الشخصية طافية فوق السرير، وتفرض انبعاج الوسادة تحت الرأس وانضغاط المرتبة تحت ثقل الجسد.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">انضغاط المرتبة تحت الحوض والفخذين</span>
              <span className="text-[10px] text-neutral-400">توزيع كتلة الجسم (83 كجم) طبيعيًا</span>
            </div>
            <span className="text-emerald-400 font-bold">✓ نشط</span>
          </div>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">انبعاج الوسادة عند الاستناد والاستلقاء</span>
              <span className="text-[10px] text-neutral-400">طيات القماش حول الرأس والأكتاف</span>
            </div>
            <span className="text-emerald-400 font-bold">✓ نشط</span>
          </div>
        </div>
      </section>

      {/* 4. Persistent 3D Coordinates Inspection */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">إحداثيات الغرفة المكانية الثابتة (3D Spatial Memory)</h3>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">6.2m x 5.2m x 2.9m</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {state.bedroomGeometry.spatialObjects.map((obj) => (
            <div key={obj.id} className="p-2.5 bg-neutral-950/80 rounded-xl border border-neutral-800/80">
              <span className="font-bold text-white block text-[11px] mb-0.5">{obj.name}</span>
              <div className="text-[10px] text-neutral-400 font-mono">
                X: {obj.x}m • Y: {obj.y}m • Z: {obj.z}m
              </div>
              <span className="text-[9px] text-emerald-400 block mt-0.5">ثابت ومحمي من التبديل</span>
            </div>
          ))}
        </div>
      </section>
        </>
      )}

      <ContextualPhysicsPanel />
      <V6LocalStudio />

      {/* V3 Modals */}
      <DifferentialEditorModal
        isOpen={isDiffEditorOpen}
        onClose={() => setIsDiffEditorOpen(false)}
      />

      <DecisionsExplanationModal
        isOpen={isDecisionsOpen}
        onClose={() => setIsDecisionsOpen(false)}
      />

      <ReadinessModal
        isOpen={isReadinessOpen}
        onClose={() => setIsReadinessOpen(false)}
      />
    </div>
  );
};
