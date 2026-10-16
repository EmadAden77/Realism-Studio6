import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Download,
  BookmarkPlus,
  RefreshCw,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Edit3,
  GitCompare
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { exportPromptAsTxt, exportSceneAsJson } from '../../lib/storage/sceneStorage';
import { PromptComparisonModal } from './PromptComparisonModal';

export const PromptOutputView: React.FC = () => {
  const {
    state,
    generatePrompt,
    isRefiningPrompt,
    saveCurrentScene,
    updateGlobalSceneState
  } = useSceneStore();

  const [copiedType, setCopiedType] = useState<'prompt' | 'negative' | 'both' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState(state.output.englishPrompt);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // If prompt is empty on initial load, generate it immediately
  useEffect(() => {
    if (!state.output.englishPrompt) {
      generatePrompt(false);
    } else {
      setEditablePrompt(state.output.englishPrompt);
    }
  }, [state.output.englishPrompt, generatePrompt]);

  const handleCopy = (text: string, type: 'prompt' | 'negative' | 'both') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyBoth = () => {
    const combined = `POSITIVE PROMPT:\n${state.output.englishPrompt}\n\nNEGATIVE PROMPT:\n${state.output.negativePrompt}`;
    handleCopy(combined, 'both');
  };

  const handleSaveScene = () => {
    saveCurrentScene();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleApplyEdit = () => {
    updateGlobalSceneState((prev) => ({
      ...prev,
      output: {
        ...prev.output,
        englishPrompt: editablePrompt
      }
    }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* 1. Header & AI Refine Banner */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            مخرجات البرومبت الاحترافية (Prompt Output)
            {state.output.isAiRefined && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                Gemini 3.8 Refined ✨
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            برومبت إنجليزي فائق الدقة، مؤسس فيزيائيًا ومتوافق مع محركات التوليد الحديثة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generatePrompt(true)}
            disabled={isRefiningPrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRefiningPrompt ? 'animate-spin' : ''}`} />
            <span>{isRefiningPrompt ? 'جاري التحسين الذكي...' : 'تحسين بالذكاء الاصطناعي'}</span>
          </button>

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition"
            title="مقارنة النسخ وتدقيق الفروق"
          >
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">مقارنة النسخ</span>
          </button>

          <button
            onClick={() => generatePrompt(false)}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition"
            title="إعادة تجميع البرومبت"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Primary English Prompt Card */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-neutral-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 font-mono" dir="ltr">
              Positive Prompt (English)
            </span>
            <span className="text-[10px] bg-neutral-950 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">
              {state.output.englishPrompt.length} chars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'إلغاء التعديل' : 'تعديل يدوي'}</span>
            </button>
            <button
              onClick={() => handleCopy(state.output.englishPrompt, 'prompt')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition shadow-sm"
            >
              {copiedType === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'prompt' ? 'تم النسخ!' : 'نسخ البرومبت'}</span>
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              rows={8}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleApplyEdit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
            >
              حفظ التعديلات
            </button>
          </div>
        ) : (
          <div className="bg-neutral-950/90 border border-neutral-800/90 rounded-xl p-3.5 text-xs text-neutral-200 font-mono leading-relaxed select-all max-h-72 overflow-y-auto">
            {state.output.englishPrompt || 'جاري تجميع عناصر المشهد...'}
          </div>
        )}
      </section>

      {/* 3. Scene-Specific Negative Prompt */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-neutral-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-400 font-mono" dir="ltr">
              Negative Prompt (Scene Specific)
            </span>
          </div>

          <button
            onClick={() => handleCopy(state.output.negativePrompt, 'negative')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-rose-300 text-xs font-bold rounded-lg transition border border-neutral-700"
          >
            {copiedType === 'negative' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'negative' ? 'تم النسخ!' : 'نسخ البرومبت السلبي'}</span>
          </button>
        </div>

        <div className="bg-neutral-950/90 border border-neutral-800/90 rounded-xl p-3.5 text-xs text-neutral-300 font-mono leading-relaxed select-all">
          {state.output.negativePrompt}
        </div>
      </section>

      {/* 4. Validation Status & Applied Corrections */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2 mb-2 font-bold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>حالة المطابقة الفيزيائية:</span>
        </div>
        {state.validationIssues.length === 0 ? (
          <div className="text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 p-2.5 rounded-xl">
            ✓ كافة القواعد الفيزيائية سليمة (لا توجد تعارضات بين الكاميرا، الإضاءة، أو فيزياء الأقمشة).
          </div>
        ) : (
          <div className="text-amber-300 bg-amber-950/30 border border-amber-800/30 p-2.5 rounded-xl">
            يوجد {state.validationIssues.length} تنبيه فيزيائي تم رصده في هذا المشهد.
          </div>
        )}

        {state.output.appliedCorrections && state.output.appliedCorrections.length > 0 && (
          <div className="mt-2 text-neutral-400">
            <span className="font-semibold text-neutral-300 block mb-1">تصحيحات تم تطبيقها آليًا:</span>
            <div className="flex flex-wrap gap-1.5">
              {state.output.appliedCorrections.map((corr, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-800 text-[10px] text-amber-300 px-2 py-0.5 rounded border border-neutral-700"
                >
                  ✓ {corr}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. Actions / Export & Save */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={handleCopyBoth}
          className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition border border-neutral-700"
        >
          {copiedType === 'both' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>نسخ الاثنين معًا</span>
        </button>

        <button
          onClick={handleSaveScene}
          className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition border border-amber-500/40"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>{saveSuccess ? 'تم الحفظ في المكتبة!' : 'حفظ المشهد'}</span>
        </button>

        <button
          onClick={() => exportPromptAsTxt(state.output.englishPrompt, state.output.negativePrompt, state.title)}
          className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition border border-neutral-700"
        >
          <Download className="w-4 h-4" />
          <span>تصدير ملف TXT</span>
        </button>

        <button
          onClick={() => exportSceneAsJson(state)}
          className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition border border-neutral-700"
        >
          <FileCode className="w-4 h-4" />
          <span>تصدير ملف JSON</span>
        </button>
      </div>

      {/* Model Compatibility Notice */}
      <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 text-center">
        متوافق مع: <strong className="text-neutral-200">Midjourney v6.1</strong> • <strong className="text-neutral-200">Flux.1 Schnell/Dev</strong> • <strong className="text-neutral-200">Stable Diffusion 3.5 Large</strong> • <strong className="text-neutral-200">Ideogram v2</strong>
      </div>

      {/* V3 Prompt Comparison Modal */}
      <PromptComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
};
