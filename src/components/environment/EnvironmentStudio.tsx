/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Moon,
  Shirt,
  UserCheck,
  Package,
  Layers,
  Sparkles,
  ShieldAlert,
  Info,
  Maximize2
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import {
  LOCATION_PRESETS,
  POSE_PRESETS,
  OUTFIT_PRESETS,
  SAUDI_CITIES,
} from '../../lib/presets/data';
import { AspectRatio, CameraAngle, CameraMode, LightingMode, SaudiCity } from '../../types/scene';

type SceneSubTab = 'location' | 'camera' | 'lighting' | 'pose' | 'clothing' | 'disorder';

export const EnvironmentStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<SceneSubTab>('location');

  const {
    state,
    selectLocationPreset,
    updateCamera,
    updateLighting,
    selectPosePreset,
    updatePose,
    selectOutfitPreset,
    updateClothing,
    updateFabric,
    updateDisorder,
    updateGlobalSceneState
  } = useSceneStore();

  const subTabs: { id: SceneSubTab; labelAr: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'location', labelAr: 'الموقع والبيئة', icon: MapPin },
    { id: 'camera', labelAr: 'الكاميرا والعدسة', icon: Camera },
    { id: 'lighting', labelAr: 'الإضاءة والواقعية', icon: Moon },
    { id: 'pose', labelAr: 'الوضعية والذراع', icon: UserCheck },
    { id: 'clothing', labelAr: 'الملابس والأقمشة', icon: Shirt },
    { id: 'disorder', labelAr: 'الفوضى الحياتية', icon: Package },
  ];

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* Horizontal Sub-tabs bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-800 no-scrollbar">
        {subTabs.map((tab) => {
          const isActive = subTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.labelAr}</span>
            </button>
          );
        })}
      </div>

      {/* 1. LOCATION & SAUDI ENVIRONMENT SUB-TAB */}
      {subTab === 'location' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>اختر موقع المشهد</span>
              <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                Location Presets
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3">
              مواقع سعودية ويومية حقيقية خالية من المبالغات السياحية والاستشراقية
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOCATION_PRESETS.map((loc) => {
                const isSelected = state.locationPresetId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => selectLocationPreset(loc.id)}
                    className={`text-right p-3 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow-md ring-1 ring-amber-500/20'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-300">{loc.nameAr}</span>
                      <span className="text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 font-mono">
                        {loc.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">{loc.descriptionAr}</p>
                    <div className="text-[10px] text-neutral-500">
                      عناصر فيزيائية: {loc.physicalElementsEn.slice(0, 2).join(' • ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Regional Settings */}
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>المنطقة والمدينة السعودية</span>
              <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                Regional Engine
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAUDI_CITIES.slice(0, 8).map((city) => {
                const isSelected = state.saudiEnvironment.city === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() =>
                      updateGlobalSceneState((prev) => ({
                        ...prev,
                        saudiEnvironment: { ...prev.saudiEnvironment, city: city.id }
                      }))
                    }
                    className={`p-2 rounded-xl border text-xs text-center transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    {city.nameAr}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 2. CAMERA STUDIO SUB-TAB */}
      {subTab === 'camera' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>محاكاة كاميرا شاومي 15 ألترا</span>
                  <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                    Xiaomi 15 Ultra
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">بصريات حقيقية للمستشعر والعدسة والعمق البصري</p>
              </div>
              <span className="text-[10px] bg-neutral-950 border border-neutral-800 text-amber-400 px-2 py-1 rounded font-mono">
                {state.camera.mode === 'front_selfie' ? '21mm • f/2.0' : '23mm 1-inch • f/1.63'}
              </span>
            </div>

            {/* Camera Mode */}
            <div className="mb-4">
              <label className="text-xs text-neutral-300 font-semibold block mb-1.5">وضع التصوير (Camera Mode):</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'front_selfie', labelAr: 'سيلفي كاميرا أمامية (21mm f/2.0)', descAr: 'زاوية واسعة طبيعية وعمق مجال واسع' },
                  { id: 'rear_main_self_capture', labelAr: 'كاميرا خلفية رئيسية (23mm f/1.63)', descAr: 'مستشعر 1 بوصة وعزل بصري طبيعي' },
                  { id: 'mirror_selfie', labelAr: 'سيلفي المرآة (Mirror Selfie)', descAr: 'ظهور الهاتف باليد وزوايا انعكاس دقيقة' },
                  { id: 'third_person_phone', labelAr: 'لقطة هاتف عفوية (شخص ثالث)', descAr: 'تصوير عفوي من مسافة طبيعية' },
                ].map((mode) => {
                  const isSelected = state.camera.mode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() =>
                        updateCamera({
                          mode: mode.id as CameraMode,
                          focalLengthEquivMm: mode.id === 'front_selfie' ? 21 : 23,
                          aperture: mode.id === 'front_selfie' ? 'f/2.0' : 'f/1.63'
                        })
                      }
                      className={`text-right p-2.5 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                      }`}
                    >
                      <span className="font-bold block text-white text-[11px]">{mode.labelAr}</span>
                      <span className="text-[10px] text-neutral-400">{mode.descAr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-4">
              <label className="text-xs text-neutral-300 font-semibold block mb-1.5">أبعاد الصورة (Aspect Ratio):</label>
              <div className="grid grid-cols-5 gap-2">
                {(['9:16', '1:1', '4:5', '3:4', '16:9'] as AspectRatio[]).map((ratio) => {
                  const isSelected = state.camera.aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => updateCamera({ aspectRatio: ratio })}
                      className={`py-2 rounded-xl border text-xs font-mono font-bold transition ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800/40'
                      }`}
                    >
                      {ratio}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Angle */}
            <div>
              <label className="text-xs text-neutral-300 font-semibold block mb-1.5">زاوية الكاميرا (Camera Angle):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'eye_level', labelAr: 'مستوى العين مباشرة' },
                  { id: 'slightly_elevated', labelAr: 'مرتفعة قليلًا (سيلفي كلاسيكي)' },
                  { id: 'elevated', labelAr: 'زاوية علوية معتدلة' },
                  { id: 'reclining_angle', labelAr: 'زاوية استلقاء على السرير' },
                ].map((angle) => {
                  const isSelected = state.camera.angle === angle.id;
                  return (
                    <button
                      key={angle.id}
                      onClick={() => updateCamera({ angle: angle.id as CameraAngle })}
                      className={`p-2 rounded-xl border text-xs text-center transition ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500/50 text-white font-medium'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                      }`}
                    >
                      {angle.labelAr}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 3. LIGHTING STUDIO SUB-TAB */}
      {subTab === 'lighting' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>إعدادات الإضاءة الفيزيائية</span>
                  <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                    Lighting Studio
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">تطبيق قانون التربيع العكسي ومنع الإضاءة المصطنعة</p>
              </div>
              <button
                onClick={() => updateLighting({ strictRealismLock: !state.lighting.strictRealismLock })}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                  state.lighting.strictRealismLock
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                قفل الواقعية الصارم: {state.lighting.strictRealismLock ? 'مفعل' : 'معطل'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {[
                { id: 'phone_screen_only', labelAr: 'إضاءة شاشة الهاتف فقط (~6500K)', descAr: 'غرفة مظلمة تمامًا، تلاشي الضوء السريع، ظلال عميقة واقعية' },
                { id: 'natural_daylight', labelAr: 'ضوء نهار طبيعي من النافذة', descAr: 'إضاءة محيطية ناعمة وظلال خفيفة منتشرة' },
                { id: 'late_afternoon', labelAr: 'شمس العصر الذهبية', descAr: 'زاوية شمس منخفضة ودفء لوني وانعكاسات طبيعية' },
                { id: 'street_led', labelAr: 'أعمدة إنارة الشارع السكني LED', descAr: 'إضاءة رأسية دافئة مع ظلال هابطة على الأسفلت والرصيف' },
                { id: 'vehicle_dashboard', labelAr: 'شاشات وعدادات السيارة ليلًا', descAr: 'إضاءة خافتة زرقاء أو كهرمانية على جانب الوجه والكتف' },
                { id: 'mixed_practical', labelAr: 'إضاءة داخلية متوازنة', descAr: 'مصابيح سقف عادية هادئة بدون تباين درامي استعراضي' },
              ].map((light) => {
                const isSelected = state.lighting.mode === light.id;
                return (
                  <button
                    key={light.id}
                    onClick={() =>
                      updateLighting({
                        mode: light.id as LightingMode,
                        timeOfDay: light.id.includes('night') || light.id === 'phone_screen_only' ? 'night' : 'day',
                        secondarySourceEnabled: light.id === 'phone_screen_only' ? false : state.lighting.secondarySourceEnabled
                      })
                    }
                    className={`text-right p-3 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="font-bold block text-white text-[11px] mb-0.5">{light.labelAr}</span>
                    <span className="text-[10px] text-neutral-400 leading-relaxed">{light.descAr}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs text-neutral-300">
              <span className="font-bold text-amber-300 block mb-1">قواعد الإضاءة المطبقة:</span>
              <ul className="text-[11px] text-neutral-400 space-y-1 list-disc list-inside">
                <li>منع إضاءة الحواف المصطنعة (No Fake Rim Light)</li>
                <li>منع مصابيح التعبئة المخفية للوجه (No Invisible Face Fill)</li>
                <li>الحفاظ على مدى المستشعر الديناميكي الحقيقي والتحبب في الإضاءة المنخفضة</li>
              </ul>
            </div>
          </section>
        </div>
      )}

      {/* 4. POSE & BIOMECHANICS SUB-TAB */}
      {subTab === 'pose' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>مكتبة الوضعيات الحركية</span>
              <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                50+ Poses
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3">
              وضعيات جسدية عفوية ومطابقة لتشريح حركة الإنسان وارتكاز الجاذبية
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POSE_PRESETS.map((preset) => {
                  const isSelected = state.pose.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => selectPosePreset(preset.id)}
                      className={`text-right p-3 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                      }`}
                    >
                      <span className="font-bold block text-white text-[11px] mb-1">{preset.nameAr}</span>
                      <p className="text-[10px] text-neutral-400 leading-relaxed mb-1.5">{preset.descriptionAr}</p>
                      <span className="text-[9px] text-amber-400/90 font-mono block">
                        تأثير القماش: {preset.fabricTensionEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selfie Arm Length Slider */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-300 font-semibold">مسافة ذراع السيلفي للوجه:</span>
                  <span className="font-mono text-amber-400">{state.pose.selfieArmDistanceCm} سم</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="70"
                  value={state.pose.selfieArmDistanceCm}
                  onChange={(e) => updatePose({ selfieArmDistanceCm: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block mt-1">
                  المدى الواقعي لذراع الإنسان البالغ يتراوح بين 45 و 65 سم
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 5. CLOTHING & FABRIC PHYSICS SUB-TAB */}
      {subTab === 'clothing' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>أطقم الملابس الجاهزة</span>
              <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                Outfit Presets
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {OUTFIT_PRESETS.map((preset) => {
                const isSelected = state.clothing.activeOutfitPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectOutfitPreset(preset.id)}
                    className={`text-right p-3 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-500/50 text-white font-medium shadow'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className="font-bold block text-white text-[11px] mb-1">{preset.nameAr}</span>
                    <span className="text-[10px] text-neutral-400 block">{preset.upperAr}</span>
                    <span className="text-[10px] text-neutral-400 block">{preset.lowerAr}</span>
                  </button>
                );
              })}
            </div>

            {/* Strict Fabric Physics Engine */}
            <div className="border-t border-neutral-800 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>محرك فيزياء الأقمشة الصارم</span>
                  <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                    Fabric Physics
                  </span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                  مفعل افتراضيًا
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                يضمن هذا المحرك طيات حقيقية ناتجة عن وزن القماش وانضغاطه بالجلوس أو الاستلقاء، وتجنب الملابس البلاستيكية المشدودة كالمطاط أو الملابس المطلية رقميًا.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-300">
                  ✓ استجابة الجاذبية ونقاط الارتكاز بالأكتاف
                </div>
                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-300">
                  ✓ طيات انضغاط الحوض والفخذين
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 6. LIVED-IN DISORDER SUB-TAB */}
      {subTab === 'disorder' && (
        <div className="space-y-4">
          <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span>الفوضى اليومية الحياتية</span>
              <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800" dir="ltr">
                Lived-in Disorder
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3">
              الواقعية تنبع من آثار الاستخدام اليومي المعقول (كابل شحن، لحاف مزاح، وسادة مضغوطة)
            </p>

            {/* Level slider */}
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-200">مستوى الفوضى الحياتية:</span>
                <span className="font-bold text-amber-400">
                  {state.disorder.level === 0 && '0 - مرتب تمامًا كالمعرض'}
                  {state.disorder.level === 1 && '1 - استخدام خفيف'}
                  {state.disorder.level === 2 && '2 - يومي طبيعي (الموصى به)'}
                  {state.disorder.level === 3 && '3 - عشوائية واضحة خفيفة'}
                  {state.disorder.level === 4 && '4 - آثار حركة ونشاط مستمر'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={state.disorder.level}
                onChange={(e) => updateDisorder({ level: Number(e.target.value) as any })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Active Items */}
            <div>
              <label className="text-xs text-neutral-300 font-semibold block mb-2">
                العناصر الحياتية النشطة في المحيط:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'displaced_grey_duvet', labelAr: 'لحاف السرير مزاح قليلًا بعفوية' },
                  { id: 'compressed_pillow', labelAr: 'وسادة مضغوطة من أثر الاستناد' },
                  { id: 'smartphone_charging_cable_on_nightstand', labelAr: 'كابل شاحن هاتف على الكومودينة' },
                  { id: 'water_bottle_on_bedside_table', labelAr: 'قارورة ماء بجانب السرير' },
                ].map((item) => {
                  const isActive = state.disorder.activeItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        const next = isActive
                          ? state.disorder.activeItems.filter((i) => i !== item.id)
                          : [...state.disorder.activeItems, item.id];
                        updateDisorder({ activeItems: next });
                      }}
                      className={`text-right p-2.5 rounded-xl border text-xs transition ${
                        isActive
                          ? 'bg-neutral-800 border-amber-500/50 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span>{item.labelAr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
