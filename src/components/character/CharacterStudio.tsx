/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  Lock,
  Unlock,
  Upload,
  User,
  Scissors,
  Smile,
  Eye,
  Glasses,
  CheckCircle2,
  Trash2,
  Shield,
  Info
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import {
  EXPRESSION_PRESETS,
  GAZE_PRESETS,
  HAIR_PRESETS,
} from '../../lib/presets/data';
import { IdentityLocks } from '../../types/scene';
import { ReferenceAnalysisPanel } from '../reference/ReferenceAnalysisPanel';

export const CharacterStudio: React.FC = () => {
  const {
    state,
    updateIdentity,
    toggleIdentityLock,
    updateHair,
    updateFacialHair,
    updateExpression,
    updateGaze,
    updateEyewear
  } = useSceneStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('حجم الصورة يجب أن لا يتجاوز 8 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateIdentity({
          referenceImageUrl: url,
          referenceImageName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    updateIdentity({
      referenceImageUrl: null,
      referenceImageName: null
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const locksList: { key: keyof IdentityLocks; labelAr: string; descAr: string }[] = [
    { key: 'faceAndSkull', labelAr: 'قفل هيكل الوجه والجمجمة', descAr: 'تثبيت أبعاد عظام الفك والوجنتين' },
    { key: 'eyeAndNose', labelAr: 'قفل العين والأنف', descAr: 'منع تشويه محجر العين وشكل الأنف الطبيعي' },
    { key: 'skinTone', labelAr: 'قفل لون البشرة والملمس', descAr: 'بشرة قمحية سعودية طبيعية بدون تفتيح' },
    { key: 'hairline', labelAr: 'قفل خط الشعر الطبيعي', descAr: 'منع تقديم خط الجبهة أو طمس الصدغين' },
    { key: 'hairDensity', labelAr: 'قفل كثافة الشعر', descAr: 'منع التكثيف الاصطناعي (Anti-CGI Helmet)' },
    { key: 'facialHair', labelAr: 'قفل حدود اللحية والشارب', descAr: 'الحفاظ على نمط النمو والمسامات الطبيعية' },
    { key: 'apparentAge', labelAr: 'قفل العمر التقديري', descAr: 'تثبيت العمر التقديري للشخصية (27 سنة)' },
    { key: 'bodyProportions', labelAr: 'قفل أبعاد القامة والجسد', descAr: 'طول 193 سم ووزن 83 كجم بقوام رياضي' }
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* 1. Reference Image & Identity Locks */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>هوية الشخصية المرجعية</span>
                <span className="text-[10px] text-amber-400/90 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                  Identity
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                الصورة المرجعية هي مصدر الهوية فقط ولا تفرض الخلفية أو الإضاءة
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
            <Shield className="w-3 h-3" />
            أقفال الحماية نشطة
          </span>
        </div>

        {/* Reference Image Upload & Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {state.identity.referenceImageUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-neutral-700 aspect-[3/4] bg-neutral-950 flex items-center justify-center">
                <img
                  src={state.identity.referenceImageUrl}
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium w-full flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    تغيير الصورة
                  </button>
                  <button
                    onClick={removeReferenceImage}
                    className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-medium w-full flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-neutral-900/90 text-[10px] text-neutral-300 px-2 py-0.5 rounded backdrop-blur">
                  مرجع محلي آمن
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-amber-500/50 rounded-xl aspect-[3/4] flex flex-col items-center justify-center p-4 text-center cursor-pointer bg-neutral-950/40 hover:bg-neutral-900/50 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-neutral-200 block mb-1">
                  رفع صورة مرجعية
                </span>
                <span className="text-[10px] text-neutral-500 leading-tight">
                  تحليل محلي للهيكل والملامح دون حفظ خارجي
                </span>
              </div>
            )}
          </div>

          {/* Body Measurements & Proportions */}
          <div className="sm:col-span-2 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">الطول (سم)</label>
                <input
                  type="number"
                  value={state.identity.heightCm}
                  onChange={(e) => updateIdentity({ heightCm: Number(e.target.value) || 193 })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">الوزن (كجم)</label>
                <input
                  type="number"
                  value={state.identity.weightKg}
                  onChange={(e) => updateIdentity({ weightKg: Number(e.target.value) || 83 })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">العمر التقديري</label>
                <input
                  type="number"
                  value={state.identity.apparentAge}
                  onChange={(e) => updateIdentity({ apparentAge: Number(e.target.value) || 27 })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">بنية الجسد</label>
                <select
                  value={state.identity.bodyType}
                  onChange={(e) => updateIdentity({ bodyType: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="tall_lean_athletic">طويل، قوام رياضي رشيق (Tall, lean-athletic)</option>
                  <option value="athletic">رياضي مفتول (Athletic)</option>
                  <option value="average">معتدل طبيعي (Average)</option>
                  <option value="slender">نحيل خفيف (Slender)</option>
                  <option value="broad_build">عريض المنكبين (Broad build)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">وصف الملامح الفريدة</label>
              <input
                type="text"
                value={state.identity.customDescription}
                onChange={(e) => updateIdentity({ customDescription: e.target.value })}
                placeholder="مثال: شاب عربي بملامح حادة طبيعية وابتسامة غائبة وهدوء واضح"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 8 Identity Locks */}
        <div className="border-t border-neutral-800 pt-3">
          <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-neutral-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>أقفال الهوية الثابتة (Identity Locks)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {locksList.map((lock) => {
              const isLocked = state.identity.locks[lock.key];
              return (
                <button
                  key={lock.key}
                  onClick={() => toggleIdentityLock(lock.key)}
                  className={`text-right p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isLocked
                      ? 'bg-neutral-950/80 border-amber-500/40 text-neutral-100 shadow-sm'
                      : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white text-[11px]">{lock.labelAr}</span>
                    <span className="text-[10px] text-neutral-400">{lock.descAr}</span>
                  </div>
                  <div
                    className={`p-1 rounded-md ${
                      isLocked ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 bg-neutral-800'
                    }`}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* V3 Reference Fidelity & Observation Review */}
      <ReferenceAnalysisPanel />

      {/* 2. Hair Studio */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>استوديو الشعر</span>
                <span className="text-[10px] text-amber-400/90 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                  Hair Studio
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                الحفاظ على الكثافة الطبيعية ومنع الشعر البلاستيكي المستعار
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800 text-[11px]">
            <span className="text-neutral-400">قفل الكثافة:</span>
            <span className="font-bold text-emerald-400">مفعل</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HAIR_PRESETS.map((preset) => {
              const isSelected = state.hair.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => updateHair({ presetId: preset.id })}
                  className={`text-right p-2.5 rounded-xl border text-xs transition ${
                    isSelected
                      ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                  }`}
                >
                  <span className="block font-semibold mb-0.5">{preset.nameAr}</span>
                  <span className="text-[10px] text-neutral-400 line-clamp-1">{preset.nameEn}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-xs flex items-start gap-2 text-neutral-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">فيزياء تكتل الشعر (Hair Clumping):</span>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                يتم توليد الشعر في مجموعات وخصلات طبيعية (Groups & Clumps) متوافقة مع قفل الكثافة، مع تجنب الشعر المفرود الاصطناعي الشبيه بالخيوط ثلاثية الأبعاد (CGI string-like strands).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Facial Hair Studio */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>شعر الوجه واللحية</span>
              <span className="text-[10px] text-amber-400/90 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                Facial Hair
              </span>
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400">تدرج ومسامات طبيعية</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'natural_stubble', labelAr: 'شعر لحية خفيف طبيعي (Stubble)', labelEn: 'Natural stubble' },
            { id: 'short_boxed', labelAr: 'لحية قصيرة محددة باعتدال', labelEn: 'Short-boxed beard' },
            { id: 'neatly_trimmed', labelAr: 'لحية مهذبة ومحددة بعناية', labelEn: 'Neatly trimmed' },
            { id: 'clean_shaven', labelAr: 'حليق الوجه بالكامل', labelEn: 'Clean shaven' },
          ].map((item) => {
            const isSelected = state.facialHair.growthTexture === item.id;
            return (
              <button
                key={item.id}
                onClick={() => updateFacialHair({ growthTexture: item.id as any })}
                className={`text-right p-2.5 rounded-xl border text-xs transition ${
                  isSelected
                    ? 'bg-neutral-800 border-amber-500/50 text-white font-medium'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                }`}
              >
                <span className="block font-semibold mb-0.5">{item.labelAr}</span>
                <span className="text-[10px] text-neutral-400">{item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Facial Expression & Gaze */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">تعبيرات الوجه ونظرة العين</h2>
              <p className="text-[11px] text-neutral-400">27 تعبير طبيعي غير متكلف مع ضبط حدة الانفعال</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Intensity selector */}
          <div>
            <label className="text-xs text-neutral-300 font-semibold block mb-1.5">
              درجة وضوح التعبير (Expression Intensity):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'very_subtle', labelAr: 'خفيف جدًا (غير محسوس تقريبًا)', labelEn: 'Very Subtle' },
                { id: 'subtle', labelAr: 'طبيعي معتدل (الموصى به)', labelEn: 'Subtle' },
                { id: 'moderate', labelAr: 'واضح بدون مبالغة', labelEn: 'Moderate' },
              ].map((lvl) => {
                const isSelected = state.expression.intensity === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => updateExpression({ intensity: lvl.id as any })}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span>{lvl.labelAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expressions grid */}
          <div>
            <label className="text-xs text-neutral-300 font-semibold block mb-1.5">
              اختر تعبير الوجه:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPRESSION_PRESETS.map((expr) => {
                const isSelected = state.expression.presetId === expr.id;
                return (
                  <button
                    key={expr.id}
                    onClick={() => updateExpression({ presetId: expr.id })}
                    className={`text-right p-2.5 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="block font-semibold mb-0.5">{expr.nameAr}</span>
                    <span className="text-[10px] text-neutral-400 line-clamp-1">{expr.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gaze Direction */}
          <div className="border-t border-neutral-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-neutral-300">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>اتجاه نظرة العين (Gaze Target):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GAZE_PRESETS.map((gaze) => {
                const isSelected = state.gaze.targetId === gaze.id;
                return (
                  <button
                    key={gaze.id}
                    onClick={() => updateGaze({ targetId: gaze.id })}
                    className={`text-right p-2.5 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="block font-semibold mb-0.5">{gaze.nameAr}</span>
                    <span className="text-[10px] text-neutral-400 line-clamp-1">{gaze.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eyewear */}
          <div className="border-t border-neutral-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-neutral-300">
              <Glasses className="w-3.5 h-3.5 text-amber-400" />
              <span>النظارات (Eyeglasses):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'no_glasses', labelAr: 'بدون نظارة (موصى به)', labelEn: 'No glasses' },
                { id: 'prescription_glasses', labelAr: 'نظارة طبية رفيعة', labelEn: 'Prescription' },
                { id: 'sunglasses', labelAr: 'نظارة شمسية كلاسيكية', labelEn: 'Sunglasses' },
              ].map((opt) => {
                const isSelected = state.eyewear.mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateEyewear({ mode: opt.id as any })}
                    className={`text-center p-2 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span>{opt.labelAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
