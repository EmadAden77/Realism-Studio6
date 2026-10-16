/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Camera, ShieldCheck, Cpu, Lock, Sparkles, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                إعدادات ومواصفات Realism Studio AI
              </h3>
              <p className="text-[11px] text-neutral-400">
                منصة هندسية لتوليد برومبتات واقعية تحاكي كاميرا الهواتف
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-neutral-300 leading-relaxed">
          {/* Xiaomi 15 Ultra Optical Specs */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-xs">
              <Smartphone className="w-4 h-4" />
              <span>مواصفات كاميرا شاومي 15 ألترا (Xiaomi 15 Ultra)</span>
            </div>
            <ul className="text-[11px] text-neutral-400 space-y-1 list-disc list-inside">
              <li><strong>الكاميرا الأمامية:</strong> زاوية 21mm مكافئة، فتحة عدسة f/2.0، ومستشعر 32MP.</li>
              <li><strong>الكاميرا الخلفية:</strong> عدسة 23mm مكافئة، فتحة f/1.63، مستشعر كبير 1 بوصة.</li>
              <li><strong>معالجة الصورة:</strong> مسار معالجة موحد بين الوجه والخلفية بدون تنعيم تجميلي انتقائي (No Face-only Denoising).</li>
            </ul>
          </div>

          {/* Biometrics & Privacy Notice */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>الخصوصية وتخزين الصور المرجعية</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              جميع الصور المرجعية التي ترفعها يتم استعراضها ومعالجتها محليًا داخل متصفحك (Client-side memory). لا يتم رفع الصور إلى أي خادم عام أو تخزينها دون إذن صريح منك.
            </p>
          </div>

          {/* Realism Constitution */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-200 text-xs">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>دستور الواقعية ومنع الذكاء الاصطناعي الرديء (Anti-AI Slop)</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              يقوم المحرك آليًا بحظر: البشرة البلاستيكية الشمعية، تسريحة الخوذة المستعارة، الإضاءة المحيطية الاستعراضية الزائفة (Rim Light)، والملابس المطاطية الملتصقة بدون طيات فيزيائية.
            </p>
          </div>

          {/* Engine Version */}
          <div className="text-center pt-2 text-[10px] text-neutral-500 font-mono">
            REALISM STUDIO AI • Engine v1.0.4 • RTL Arabic First • 2026
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
