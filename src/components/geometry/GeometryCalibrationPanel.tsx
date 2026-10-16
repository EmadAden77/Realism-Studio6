/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ruler, ShieldCheck, AlertTriangle, User, Home, Camera, Compass } from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { SelfieFramingSimulator } from '../framing/SelfieFramingSimulator';

export const GeometryCalibrationPanel: React.FC = () => {
  const { state, updateIdentity, updateGeometryDistance } = useSceneStore();

  const geom = state.geometryCalibration;
  const reach = geom.reachStatus;
  const subj = geom.subject;
  const cam = geom.camera;
  const env = geom.environment;

  return (
    <div className="space-y-6">
      {/* 1. Interactive Framing Simulator Component */}
      <SelfieFramingSimulator />

      {/* 2. Calibration Controls Grid */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                معايرة المقاييس الفيزيائية والمعمارية (Geometry Calibration)
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                  Exact Metrics
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                أبعاد الجسم البشري، مدى الذراع، وأبعاد الغرفة الهندسية الدقيقة
              </p>
            </div>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-semibold ${
            reach.canReach
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
              : 'bg-rose-950/40 text-rose-300 border-rose-800/40 animate-pulse'
          }`}>
            {reach.canReach ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{reach.canReach ? 'مدى الذراع متوافق' : 'تجاوز تشريحي'}</span>
          </span>
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-xl border text-xs ${
          reach.canReach
            ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
            : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
        }`}>
          {reach.messageAr}
        </div>

        {/* 3 Columns: Subject Metrics, Camera Metrics, Environment Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Metrics */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3.5 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <User className="w-4 h-4 text-amber-400" />
              أبعاد الجسم البشري
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">الطول الإجمالي:</span>
                <span className="font-mono text-white font-bold">{state.identity.heightCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">عرض الكتفين:</span>
                <span className="font-mono text-neutral-300">{subj.shoulderWidthCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">أقصى مدى للذراع:</span>
                <span className="font-mono text-amber-400 font-bold">{reach.maxReachCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">الوضعية الحالية:</span>
                <span className="font-mono text-neutral-300">{subj.posture}</span>
              </div>
            </div>
          </div>

          {/* Camera Calibration */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3.5 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <Camera className="w-4 h-4 text-amber-400" />
              موقع وزاوية الكاميرا
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">مسافة الوجه:</span>
                <span className="font-mono text-white font-bold">{cam.lensToFaceDistanceCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">ارتفاع العدسة:</span>
                <span className="font-mono text-neutral-300">{cam.cameraHeightCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">زاوية الميل الرأسي:</span>
                <span className="font-mono text-neutral-300">{cam.cameraPitchDeg}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">مجال الرؤية (FOV):</span>
                <span className="font-mono text-neutral-300">{cam.fovHorizontalDeg}° (21mm)</span>
              </div>
            </div>
          </div>

          {/* Room Environment */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3.5 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <Home className="w-4 h-4 text-amber-400" />
              هندسة الغرفة الحقيقية
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">أبعاد الغرفة:</span>
                <span className="font-mono text-white font-bold">
                  {env.roomLengthM}م × {env.roomWidthM}م
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">ارتفاع السقف:</span>
                <span className="font-mono text-neutral-300">{env.ceilingHeightM} متر</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">أبعاد السرير:</span>
                <span className="font-mono text-neutral-300">{env.bedLengthCm} × {env.bedWidthCm} سم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">ممر الحركة:</span>
                <span className="font-mono text-emerald-400 font-bold">{env.walkingClearanceM} متر</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
