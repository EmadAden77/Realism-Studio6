/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wand2,
  Check,
  Copy,
  RotateCcw,
  Camera,
  Shirt,
  Moon,
  Compass,
  UserCheck,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { getDefaultPresetLibrary } from '../../lib/storage/sceneStorage';

interface HomeDashboardProps {
  onNavigateToPrompt: () => void;
  onNavigateToScene: () => void;
  onNavigateToCharacter: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateToPrompt,
  onNavigateToScene,
  onNavigateToCharacter,
}) => {
  const {
    state,
    setDescriptionInput,
    analyzeScene,
    isAnalyzing,
    analysisMessage,
    generatePrompt,
    applyAutoCorrections,
    loadScene
  } = useSceneStore();

  const [copied, setCopied] = useState(false);
  const presets = getDefaultPresetLibrary();

  const handleGenerate = async () => {
    await generatePrompt(false);
    onNavigateToPrompt();
  };

  const handleCopyExistingPrompt = () => {
    if (state.output.englishPrompt) {
      navigator.clipboard.writeText(state.output.englishPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      generatePrompt(false).then(() => {
        onNavigateToPrompt();
      });
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* 1. Hero / Smart Scene Interpreter Card */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>الوصف الذكي للمشهد</span>
                <span className="text-[10px] text-amber-400/90 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                  Smart Scene Input
                </span>
              </h2>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700/50">
            عربي / English
          </span>
        </div>

        <p className="text-xs text-neutral-400 mb-2 leading-relaxed">
          اكتب المشهد بلغتك الطبيعية، وسيقوم المحرك باستخراج الملابس، الإضاءة، الكاميرا والبيئة بدقة فيزيائية:
        </p>

        <div className="relative">
          <textarea
            value={state.descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            rows={3}
            placeholder="مثال: سيلفي عفوي داخل غرفة النوم ليلًا، تيشيرت أبيض وشورت كحلي، إضاءة شاشة الهاتف فقط، بدون نظارة وبدون ابتسامة."
            className="w-full bg-neutral-950/80 border border-neutral-700/60 rounded-xl p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons for Input */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => analyzeScene()}
              disabled={isAnalyzing || !state.descriptionInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'جاري التحليل...' : 'تحليل وضبط المشهد'}</span>
            </button>

            <button
              onClick={() => setDescriptionInput('')}
              className="px-2.5 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition"
            >
              مسح
            </button>
          </div>

          <button
            onClick={() =>
              setDescriptionInput(
                'سيلفي داخل غرفة النوم بالليل بالفانيلة البيضاء والشورت الكحلي والإضاءة من الشاشة فقط.'
              )
            }
            className="text-xs text-amber-400/90 hover:text-amber-300 underline underline-offset-4 transition"
          >
            استعادة النموذج النموذجي
          </button>
        </div>

        {/* Feedback Message */}
        {analysisMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{analysisMessage}</span>
          </div>
        )}
      </section>

      {/* 2. Quick-Start Templates */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-neutral-300">
            قوالب سريعة جاهزة
          </h3>
          <span className="text-[10px] text-neutral-500 font-mono" dir="ltr">
            QUICK PRESETS
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.map((preset) => {
            const isSelected = state.locationPresetId === preset.locationPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => loadScene(preset)}
                className={`text-right p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-800/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/40 text-neutral-300'
                }`}
              >
                <div>
                  <span className="font-bold block text-white mb-1 line-clamp-1">
                    {preset.title.replace(' (افتراضي)', '')}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                    {preset.descriptionInput}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-400/80 pt-1 border-t border-neutral-800/60">
                  <span>تطبيق المشهد</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Active Scene Summary Card */}
      <section className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">ملخص إعدادات المشهد النشط</h3>
          </div>
          <button
            onClick={onNavigateToScene}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <span>تعديل التفاصيل</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Identity & Body */}
          <div
            onClick={onNavigateToCharacter}
            className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition"
          >
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>الهوية والجسد</span>
            </div>
            <div className="font-semibold text-white truncate">
              {state.identity.heightCm} سم • {state.identity.weightKg} كجم
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              كثافة الشعر مقفولة ✓
            </div>
          </div>

          {/* Clothing */}
          <div
            onClick={onNavigateToScene}
            className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition"
          >
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1 text-[11px]">
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
              <span>الملابس والأقمشة</span>
            </div>
            <div className="font-semibold text-white truncate">
              {state.clothing.upper.nameAr}
            </div>
            <div className="text-[10px] text-neutral-400 truncate mt-0.5">
              {state.clothing.lower.nameAr}
            </div>
          </div>

          {/* Camera */}
          <div
            onClick={onNavigateToScene}
            className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition"
          >
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1 text-[11px]">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>الكاميرا والعدسة</span>
            </div>
            <div className="font-semibold text-white truncate">
              {state.camera.mode === 'front_selfie'
                ? 'سيلفي أمامية 21mm'
                : 'خلفية رئيسية 23mm'}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              نسبة {state.camera.aspectRatio}
            </div>
          </div>

          {/* Lighting */}
          <div
            onClick={onNavigateToScene}
            className="p-2.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition"
          >
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1 text-[11px]">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>الإضاءة الفيزيائية</span>
            </div>
            <div className="font-semibold text-white truncate">
              {state.lighting.mode === 'phone_screen_only'
                ? 'شاشة الهاتف فقط'
                : state.lighting.mode}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              قفل الواقعية مفعل ✓
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contradiction Resolution Notice if any */}
      {state.validationIssues.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="text-amber-400 text-base">⚠️</span>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                تم رصد {state.validationIssues.length} تعارض فيزيائي في الإعدادات الحالية
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                {state.validationIssues[0].messageAr}
              </p>
            </div>
          </div>
          <button
            onClick={applyAutoCorrections}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition shrink-0"
          >
            تصحيح تلقائي فوري
          </button>
        </div>
      )}

      {/* 5. Master Bottom Action Bar */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-850 p-4 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-xs text-neutral-400 block">جاهزية التوليد الفيزيائي:</span>
          <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            برومبت إنجليزي فائق الدقة (Xiaomi 15 Ultra Optical Simulation)
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleGenerate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>توليد وعرض البرومبت</span>
          </button>

          <button
            onClick={handleCopyExistingPrompt}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            title="نسخ البرومبت"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
