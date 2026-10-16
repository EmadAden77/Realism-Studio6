import { apiUrl } from '../../lib/ai/apiClient';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Camera
} from 'lucide-react';
import { useSceneStore } from '../../store/sceneStore';
import { evaluateGeneratedImageLocally } from '../../lib/realism/imageReview';
import { ImageReviewState } from '../../types/scene';

export const ImageReviewStudio: React.FC = () => {
  const { state, updateGlobalSceneState } = useSceneStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviewState, setReviewState] = useState<ImageReviewState>(
    state.imageReview || {
      uploadedImageUrl: null,
      uploadedImageName: null,
      isAnalyzing: false,
      analysisCompleted: false,
      reviewItems: [],
      overallRealismAssessmentAr: '',
      targetedEditInstructionsEn: ''
    }
  );

  const [copied, setCopied] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;

        setReviewState((prev) => ({
          ...prev,
          uploadedImageUrl: url,
          uploadedImageName: file.name,
          isAnalyzing: true
        }));

        try {
          // Attempt backend multimodal AI analysis via /api/review-image
          const res = await fetch(apiUrl('review-image'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: url,
              currentScene: state
            })
          });

          const data = await res.json();
          if (!data.fallback && data.data) {
            const aiReview: ImageReviewState = {
              uploadedImageUrl: url,
              uploadedImageName: file.name,
              isAnalyzing: false,
              analysisCompleted: true,
              reviewItems: data.data.reviewItems || [],
              overallRealismAssessmentAr: data.data.overallAssessmentAr || 'تم تدقيق الصورة بنجاح بواسطة الذكاء الاصطناعي',
              targetedEditInstructionsEn: data.data.targetedEditInstructionsEn || ''
            };
            setReviewState(aiReview);
            updateGlobalSceneState((prev) => ({ ...prev, imageReview: aiReview }));
            return;
          }
        } catch {
          // Fallback to local rule-based evaluation
        }

        // Local deterministic evaluation
        const localReview = evaluateGeneratedImageLocally(url, state);
        setReviewState(localReview);
        updateGlobalSceneState((prev) => ({ ...prev, imageReview: localReview }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyInstructions = () => {
    if (reviewState.targetedEditInstructionsEn) {
      navigator.clipboard.writeText(reviewState.targetedEditInstructionsEn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* 1. Header Banner */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>تدقيق الصور المولدة (Image Realism Review)</span>
                <span className="text-[10px] text-amber-400 font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800" dir="ltr">
                  Optional Review Module
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                مقارنة الصورة التي قمت بتوليدها مع القواعد الفيزيائية وأقفال الهوية لاكتشاف أي شذوذ بصري أو تجميل زائف
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed mt-3">
          <strong className="text-amber-300">ملاحظة تقنية هامة:</strong> هذا الفحص تدقيق بصري فيزيائي يحدد مواضع الخلل في الصورة المولدة (مثل استطالة الذراع أو لمعان البلاستيك أو الإضاءة الزائفة) ويقترح تعديلات دقيقة على البرومبت دون إعادة بناء المشهد من الصفر.
        </div>
      </section>

      {/* 2. Upload Box */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {reviewState.uploadedImageUrl ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <div className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 aspect-[9/16] relative group">
                <img
                  src={reviewState.uploadedImageUrl}
                  alt="Uploaded Generation"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 left-2 right-2 py-1.5 bg-neutral-900/90 text-white text-xs font-bold rounded-lg border border-neutral-700 backdrop-blur"
                >
                  استبدال الصورة
                </button>
              </div>
            </div>

            {/* Analysis details */}
            <div className="sm:col-span-2 space-y-3">
              {reviewState.isAnalyzing ? (
                <div className="py-12 text-center text-xs text-amber-300 flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
                  <span>جاري تدقيق الصورة ومقارنة بصريات الكاميرا والإضاءة...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                    <span className="font-bold text-white block mb-1">التقييم الفيزيائي الشامل:</span>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">
                      {reviewState.overallRealismAssessmentAr}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-300 block">
                      ملاحظات المطابقة ({reviewState.reviewItems.length}):
                    </span>
                    {reviewState.reviewItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-400" />
                            {item.issueAr}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            ثقة: {(item.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono" dir="ltr">
                          {item.evidenceEn}
                        </p>
                        <div className="text-[10px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20 font-mono mt-1" dir="ltr">
                          Correction: {item.suggestedPromptCorrectionEn}
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviewState.targetedEditInstructionsEn && (
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">تعديلات البرومبت المقترحة (Prompt Edit Directive):</span>
                        <button
                          onClick={handleCopyInstructions}
                          className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'تم النسخ!' : 'نسخ التعديل'}</span>
                        </button>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded font-mono text-[11px] text-neutral-200 select-all" dir="ltr">
                        {reviewState.targetedEditInstructionsEn}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer bg-neutral-950/40 hover:bg-neutral-900/50 transition group flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block mb-1">
                ارفع صورة تم توليدها للتدقيق الفيزيائي
              </span>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                سيقوم المحرك بفحص تشريح اليدين، عمق الكاميرا، اتساق الإضاءة والشعر، وتقديم توجيهات تعديل موجهة.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
