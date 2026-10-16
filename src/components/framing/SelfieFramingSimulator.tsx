/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Move, RotateCw, Maximize2, ShieldAlert, Sparkles, Compass } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { calculateFramingPreview } from '../../lib/framing/framingCalculator';

export const SelfieFramingSimulator: React.FC = () => {
  const { state, updateGeometryDistance, updateGeometryPitch, updateGeometryRoll } = useSceneStore();

  const distanceCm = state.geometryCalibration.camera.lensToFaceDistanceCm || state.pose.selfieArmDistanceCm || 56;
  const pitchDeg = state.geometryCalibration.camera.cameraPitchDeg ?? 4;
  const rollDeg = state.geometryCalibration.camera.cameraRollDeg ?? -1.5;
  const yawDeg = state.geometryCalibration.camera.cameraYawDeg ?? 3;
  const posture = state.pose.category === 'standing' ? 'standing' : state.pose.category === 'sitting' ? 'sitting' : state.pose.category === 'reclining' ? 'reclining' : 'walking';

  const framingResult = calculateFramingPreview(distanceCm, pitchDeg, yawDeg, rollDeg, posture);
  const { headBox, shoulderBox, torsoBox, armVector, backgroundCoveragePercent, verticalAngleLabelAr, distanceEffectAr } = framingResult;

  const maxReach = state.geometryCalibration.reachStatus.maxReachCm || 72;
  const isOutOfReach = distanceCm > maxReach;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-neutral-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              محاكي تأطير السيلفي الهيكلي (9:16 Selfie Framing)
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                Xiaomi 15 Ultra 21mm
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              معاينة هندسية تقريبية لنسب الرأس والكتفين ومساحة الغرفة حسب مسافة وزاوية الكاميرا
            </p>
          </div>
        </div>

        {/* Framing Stats Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
            {distanceCm} cm
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
            {pitchDeg > 0 ? `+${pitchDeg}° pitch` : `${pitchDeg}° pitch`}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
            خلفية {backgroundCoveragePercent}%
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left: 9:16 Interactive Frame Visualizer */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[240px] aspect-[9/16] bg-neutral-950 border-2 border-neutral-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Phone Sensor Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-neutral-900 rounded-full border border-neutral-800 flex items-center justify-center gap-1 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
            </div>

            {/* 9:16 Rule of Thirds Grid Guidelines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-neutral-800 z-10">
              <div className="border-r border-b border-neutral-500/40" />
              <div className="border-r border-b border-neutral-500/40" />
              <div className="border-b border-neutral-500/40" />
              <div className="border-r border-b border-neutral-500/40" />
              <div className="border-r border-b border-neutral-500/40" />
              <div className="border-b border-neutral-500/40" />
              <div className="border-r border-neutral-500/40" />
              <div className="border-r border-neutral-500/40" />
              <div />
            </div>

            {/* Handheld Roll Rotation Container */}
            <div
              className="relative w-full h-full transition-transform duration-200"
              style={{ transform: `rotate(${rollDeg}deg)` }}
            >
              {/* Background Ambient Area */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-950 to-neutral-950 flex items-start justify-center pt-8 text-[10px] text-neutral-600 font-mono">
                <span>مجال الغرفة المحيطة (~{backgroundCoveragePercent}%)</span>
              </div>

              {/* SVG Anatomical Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Arm holding the smartphone */}
                <line
                  x1={armVector.startX}
                  y1={armVector.startY}
                  x2={armVector.endX}
                  y2={armVector.endY}
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx={armVector.startX} cy={armVector.startY} r="2.5" fill="#f59e0b" />
                <circle cx={armVector.endX} cy={armVector.endY} r="3" fill="#fbbf24" />

                {/* Torso Box */}
                <rect
                  x={torsoBox.x}
                  y={torsoBox.y}
                  width={torsoBox.width}
                  height={torsoBox.height}
                  rx="6"
                  fill="#3b82f6"
                  fillOpacity="0.12"
                  stroke="#3b82f6"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />

                {/* Shoulder Line */}
                <rect
                  x={shoulderBox.x}
                  y={shoulderBox.y}
                  width={shoulderBox.width}
                  height={shoulderBox.height}
                  rx="8"
                  fill="#10b981"
                  fillOpacity="0.15"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />

                {/* Head Box */}
                <ellipse
                  cx={headBox.x + headBox.width / 2}
                  cy={headBox.y + headBox.height / 2}
                  rx={headBox.width / 2}
                  ry={headBox.height / 2}
                  fill="#f59e0b"
                  fillOpacity="0.22"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                />

                {/* Head Center Eye Line */}
                <line
                  x1={headBox.x + headBox.width * 0.2}
                  y1={headBox.y + headBox.height * 0.48}
                  x2={headBox.x + headBox.width * 0.8}
                  y2={headBox.y + headBox.height * 0.48}
                  stroke="#fde68a"
                  strokeWidth="1"
                  strokeDasharray="1 1"
                />
              </svg>

              {/* Labels inside frame */}
              <div
                className="absolute text-[9px] font-bold text-amber-300 bg-neutral-900/80 px-1 py-0.5 rounded border border-amber-500/30"
                style={{
                  left: `${headBox.x}%`,
                  top: `${Math.max(2, headBox.y - 6)}%`
                }}
              >
                الرأس
              </div>

              <div
                className="absolute text-[9px] font-bold text-emerald-300 bg-neutral-900/80 px-1 py-0.5 rounded border border-emerald-500/30"
                style={{
                  left: `${shoulderBox.x}%`,
                  top: `${shoulderBox.y}%`
                }}
              >
                الكتف
              </div>
            </div>

            {/* Bottom Disclaimer Label */}
            <div className="absolute bottom-1.5 left-2 right-2 bg-neutral-950/90 border border-neutral-800 rounded px-1.5 py-0.5 text-center z-20">
              <span className="text-[9px] text-neutral-400">معاينة هندسية تقريبية وليست صورة مولدة</span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-2 text-center text-[10px] text-neutral-400 max-w-[240px]">
            {verticalAngleLabelAr} • {distanceEffectAr}
          </div>
        </div>

        {/* Right: Controls & Biomechanical Limits */}
        <div className="md:col-span-7 space-y-4">
          {/* Distance Slider */}
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-amber-400" />
                مسافة الكاميرا عن الوجه (Lens-to-Face Distance):
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                isOutOfReach ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-neutral-800 text-amber-400'
              }`}>
                {distanceCm} سم {isOutOfReach ? '⚠️ مستحيل تشريحيًا' : '✓ طبيعي'}
              </span>
            </div>

            <input
              type="range"
              min={30}
              max={85}
              step={1}
              value={distanceCm}
              onChange={(e) => updateGeometryDistance(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>30 سم (قريب جدًا)</span>
              <span>45-65 سم (سيلفي مثالي)</span>
              <span>72 سم (أقصى مدى ذراع)</span>
              <span>85 سم</span>
            </div>

            {isOutOfReach && (
              <div className="p-2 rounded-lg bg-rose-950/50 border border-rose-800/60 text-[11px] text-rose-200 flex items-start gap-1.5 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                <span>
                  مسافة {distanceCm} سم تتجاوز أقصى طول تشريحي لذراع الشخص بطول {state.identity.heightCm} سم (الحد الأقصى {maxReach} سم). تم قيد السيلفي تلقائيًا لمنع الأذرع الطافية.
                </span>
              </div>
            )}
          </div>

          {/* Pitch Angle Slider */}
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                زاوية الارتفاع الرأسي (Camera Pitch):
              </span>
              <span className="font-mono font-bold text-amber-400 bg-neutral-800 px-2 py-0.5 rounded text-xs">
                {pitchDeg > 0 ? `+${pitchDeg}°` : `${pitchDeg}°`}
              </span>
            </div>

            <input
              type="range"
              min={-15}
              max={20}
              step={1}
              value={pitchDeg}
              onChange={(e) => updateGeometryPitch(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>-15° (زاوية منخفضة)</span>
              <span>0° (مستوى العين)</span>
              <span>+10° (مرتفعة)</span>
              <span>+20° (علوية)</span>
            </div>
          </div>

          {/* Handheld Roll Tilt */}
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                ميلان مسكة اليد الطبيعي (Handheld Roll Tilt):
              </span>
              <span className="font-mono font-bold text-amber-400 bg-neutral-800 px-2 py-0.5 rounded text-xs">
                {rollDeg}°
              </span>
            </div>

            <input
              type="range"
              min={-8}
              max={8}
              step={0.5}
              value={rollDeg}
              onChange={(e) => updateGeometryRoll(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>-8° (ميلان يسار)</span>
              <span>-1.5° (ميلان عفوي موصى به)</span>
              <span>0° (مستقيم تمامًا)</span>
              <span>+8° (ميلان يمين)</span>
            </div>
          </div>

          {/* Preset Buttons for Quick Framing */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                updateGeometryDistance(56);
                updateGeometryPitch(4);
                updateGeometryRoll(-1.5);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            >
              سيلفي غرفة النوم الموصى به
            </button>
            <button
              onClick={() => {
                updateGeometryDistance(65);
                updateGeometryPitch(0);
                updateGeometryRoll(-0.5);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            >
              مستوى العين كاجوال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
